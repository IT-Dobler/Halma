package com.itdobler.oss.halma.common.db;

import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import com.itdobler.oss.halma.common.types.id.ID;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.ConstructorExpression;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.jpa.impl.JPADeleteClause;
import com.querydsl.jpa.impl.JPAInsertClause;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.ParameterMode;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

import static java.util.Objects.requireNonNull;

/**
 * Wraps our SmartEntityManager and the JPAQueryFactory and provides typing for the AbstractEntity construct.
 */
@ApplicationScoped
public class Db {

    private final SmartEntityManager em;
    private final JPAQueryFactory queryFactory;

    public Db(EntityManager em) {
        this.em = SmartEntityManager.wrap(em);
        queryFactory = new JPAQueryFactory(em);
    }

    public <Entity extends AbstractEntity<Entity>> Optional<Entity> find(ID<Entity> id) {
        return em.find(id.getEntityClazz(), id);
    }

    public <Entity extends AbstractEntity<Entity>> Entity require(ID<Entity> id) {
        return em.find(id.getEntityClazz(), id)
                // TODO Yanic proper error handling :)
                // .orElseThrow(() -> new AppFailureException(AppFailureMessage.entityNotFound(id)));
                .orElseThrow(() -> new RuntimeException("Entity not found: " + id));
    }

    /**
     * Convenience: calls {@link #findLocked(ID, LockModeType)} with {@link LockModeType#WRITE}.
     */
    public <Entity extends AbstractEntity<Entity>> Optional<Entity> findLocked(ID<Entity> id) {
        return findLocked(id, LockModeType.WRITE);
    }

    /**
     * Get Entity and directly lock it.
     */
    public <Entity extends AbstractEntity<Entity>> Optional<Entity> findLocked(
            ID<Entity> id,
            LockModeType lockMode
    ) {
        var entityOpt = em.find(id.getEntityClazz(), id, lockMode);

        return entityOpt;
    }

    public <Entity extends AbstractEntity<?>> Entity merge(Entity entity) {
        return em.merge(entity);
    }

    public <Entity extends AbstractEntity<?>> void persist(Entity entity) {
        em.persist(entity);
    }

    public <Entity extends AbstractEntity<?>> void refresh(Entity entity) {
        em.refresh(entity);
    }

    public void flush() {
        em.flush();
    }

    /**
     * Reset the EntityManager, see {@link EntityManager#clear()}.
     */
    public void clear() {
        em.clear();
    }

    public BigInteger nextSequenceValue(String sequenceName) {
        var nextVal = (Long) em.createStoredProcedureQuery("nextval")
                .registerStoredProcedureParameter(1, String.class, ParameterMode.IN)
                .setParameter(1, sequenceName)
                .getSingleResult();

        var result = BigInteger.valueOf(nextVal);

        return requireNonNull(result, "No sequence value returned for sequence: " + sequenceName);
    }

    /**
     * <strong>Remember: references will always be != null but might fail when the actual SQL query is run!</strong>
     */
    public <Entity extends AbstractEntity<Entity>> Entity getReference(ID<Entity> id) {
        return em.getReference(id.getEntityClazz(), id);
    }

    public <Entity extends AbstractEntity<?>> void remove(Entity entity) {
        em.remove(entity);
    }

    public <Entity extends AbstractEntity<Entity>> void remove(ID<Entity> id) {
        var entity = getReference(id);
        em.remove(entity);
    }

    public <Entity, EPath extends EntityPathBase<Entity>> List<Entity> findAll(EPath path) {
        return selectFrom(path)
                .fetch();
    }

    public <Projection, Entity, EPath extends EntityPathBase<Entity>> List<Projection> findAll(
            EPath path,
            ConstructorExpression<Projection> projection
    ) {
        return select(projection)
                .from(path)
                .fetch();
    }

    public JPADeleteClause delete(EntityPath<?> path) {
        return queryFactory.delete(path);
    }

    public <Entity> SmartJPAQuery<Entity> select(Expression<Entity> expr) {
        return new SmartJPAQuery<>(queryFactory.select(expr));
    }

    public SmartJPAQuery<Tuple> select(Expression<?>... exprs) {
        return new SmartJPAQuery<>(queryFactory.select(exprs));
    }

    public <Entity> SmartJPAQuery<Entity> selectDistinct(Expression<Entity> expr) {
        return new SmartJPAQuery<>(queryFactory.selectDistinct(expr));
    }

    public SmartJPAQuery<Tuple> selectDistinct(Expression<?>... exprs) {
        return new SmartJPAQuery<>(queryFactory.selectDistinct(exprs));
    }

    public SmartJPAQuery<Integer> selectOne() {
        return new SmartJPAQuery<>(queryFactory.selectOne());
    }

    public SmartJPAQuery<Integer> selectZero() {
        return new SmartJPAQuery<>(queryFactory.selectZero());
    }

    public <Entity> SmartJPAQuery<Entity> selectFrom(EntityPath<Entity> from) {
        return new SmartJPAQuery<>(queryFactory.selectFrom(from));
    }

    public SmartJPAQuery<?> from(EntityPath<?> from) {
        return new SmartJPAQuery<>(queryFactory.from(from));
    }

    public SmartJPAQuery<?> from(EntityPath<?>... from) {
        return new SmartJPAQuery<>(queryFactory.from(from));
    }

    public JPAUpdateClause update(EntityPath<?> path) {
        return queryFactory.update(path);
    }

    public JPAInsertClause insert(EntityPath<?> path) {
        return queryFactory.insert(path);
    }

    public SmartJPAQuery<?> query() {
        return new SmartJPAQuery<>(queryFactory.query());
    }

    public SmartEntityManager unwrapEntityManager() {
        return em;
    }

    public EntityGraph<?> getEntityGraph(String graphName) {
        var entityGraph = unwrapEntityManager().getEntityGraph(graphName);

        return entityGraph;
    }
}
