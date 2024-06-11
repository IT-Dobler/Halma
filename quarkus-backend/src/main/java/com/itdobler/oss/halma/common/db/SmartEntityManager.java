package com.itdobler.oss.halma.common.db;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.metamodel.Metamodel;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Objects.requireNonNull;
import static java.util.Optional.ofNullable;

/**
 * Wraps an EntityManager and provides convenience methods.
 * The primary usage of this method is future proofing the codebase against changes in the JPA API.
 * Whatever changes come along, we only need to change a single class instead of all the places where EntityManager is used.
 *
 * Also adds lots of null-safety checks.
 */
public class SmartEntityManager {
    private final EntityManager delegate;

    private SmartEntityManager(@NotNull EntityManager delegate) {
        this.delegate = requireNonNull(delegate);
    }

    public static SmartEntityManager wrap(EntityManager delegate) {
        return new SmartEntityManager(delegate);
    }

    public EntityManager em() {
        return delegate;
    }

    public void persist(Object entity) {
        delegate.persist(entity);
    }

    public <T> @NotNull T merge(@NotNull T entity) {
        return delegate.merge(entity);
    }

    /**
     * Like {@link #merge(Object)} but calls {@link #flush()} thereafter.
     */
    public <T> @NotNull T mergeSync(@NotNull T entity) {
        T result = merge(entity);
        flush();

        return result;
    }

    public void remove(Object entity) {
        delegate.remove(entity);
    }

    public <T> @NotNull Optional<@NotNull T> find(Class<T> entityClass, Object primaryKey) {
        return ofNullable(delegate.find(entityClass, primaryKey));
    }

    public <T> @NotNull Optional<@NotNull T> find(
        Class<T> entityClass, Object primaryKey, Map<String, Object>
        properties
    ) {

        return ofNullable(delegate.find(entityClass, primaryKey, properties));
    }

    public <T> @NotNull Optional<@NotNull T> find(Class<T> entityClass, Object primaryKey, LockModeType lockMode) {
        return ofNullable(delegate.find(entityClass, primaryKey, lockMode));
    }

    public <T> @NotNull Optional<@NotNull T> find(
        Class<T> entityClass, Object primaryKey, LockModeType lockMode,
        Map<String, Object> properties
    ) {

        return ofNullable(delegate.find(entityClass, primaryKey, lockMode, properties));
    }

    public <T> T getReference(Class<T> entityClass, Object primaryKey) {
        return delegate.getReference(entityClass, primaryKey);
    }

    public void flush() {
        delegate.flush();
    }

    public FlushModeType getFlushMode() {
        return delegate.getFlushMode();
    }

    public void setFlushMode(FlushModeType flushMode) {
        delegate.setFlushMode(flushMode);
    }

    public void lock(Object entity, LockModeType lockMode) {
        delegate.lock(entity, lockMode);
    }

    public void lock(Object entity, LockModeType lockMode, Map<String, Object> properties) {
        delegate.lock(entity, lockMode, properties);
    }

    public void refresh(Object entity) {
        delegate.refresh(entity);
    }

    public void refresh(Object entity, Map<String, Object> properties) {
        delegate.refresh(entity, properties);
    }

    public void refresh(Object entity, LockModeType lockMode) {
        delegate.refresh(entity, lockMode);
    }

    public void refresh(Object entity, LockModeType lockMode, Map<String, Object> properties) {
        delegate.refresh(entity, lockMode, properties);
    }

    public void clear() {
        delegate.clear();
    }

    public void detach(Object entity) {
        delegate.detach(entity);
    }

    public boolean contains(Object entity) {
        return delegate.contains(entity);
    }

    public LockModeType getLockMode(Object entity) {
        return delegate.getLockMode(entity);
    }

    public void setProperty(String propertyName, Object value) {
        delegate.setProperty(propertyName, value);
    }

    public Map<String, Object> getProperties() {
        return delegate.getProperties();
    }

    public Query createQuery(String qlString) {
        return delegate.createQuery(qlString);
    }

    public <T> SmartTypedQuery<T> createQuery(CriteriaQuery<T> criteriaQuery) {
        return new SmartTypedQuery<>(delegate.createQuery(criteriaQuery));
    }

    public Query createQuery(CriteriaUpdate<?> updateQuery) {
        return delegate.createQuery(updateQuery);
    }

    public Query createQuery(CriteriaDelete<?> deleteQuery) {
        return delegate.createQuery(deleteQuery);
    }

    public <T> SmartTypedQuery<T> createQuery(String qlString, Class<T> resultClass) {
        return new SmartTypedQuery<>(delegate.createQuery(qlString, resultClass));
    }

    public Query createNamedQuery(String name) {
        return delegate.createNamedQuery(name);
    }

    public <T> SmartTypedQuery<T> createNamedQuery(String name, Class<T> resultClass) {
        return new SmartTypedQuery<>(delegate.createNamedQuery(name, resultClass));
    }

    public Query createNativeQuery(String sqlString) {
        return delegate.createNativeQuery(sqlString);
    }

    public Query createNativeQuery(String sqlString, Class<?> resultClass) {
        return delegate.createNativeQuery(sqlString, resultClass);
    }

    public Query createNativeQuery(String sqlString, String resultSetMapping) {
        return delegate.createNativeQuery(sqlString, resultSetMapping);
    }

    public StoredProcedureQuery createNamedStoredProcedureQuery(String name) {
        return delegate.createNamedStoredProcedureQuery(name);
    }

    public StoredProcedureQuery createStoredProcedureQuery(String procedureName) {
        return delegate.createStoredProcedureQuery(procedureName);
    }

    @SuppressWarnings("OverloadedVarargsMethod")
    public StoredProcedureQuery createStoredProcedureQuery(String procedureName, Class<?>... resultClasses) {
        return delegate.createStoredProcedureQuery(procedureName, resultClasses);
    }

    @SuppressWarnings("OverloadedVarargsMethod")
    public StoredProcedureQuery createStoredProcedureQuery(String procedureName, String... resultSetMappings) {
        return delegate.createStoredProcedureQuery(procedureName, resultSetMappings);
    }

    public void joinTransaction() {
        delegate.joinTransaction();
    }

    public boolean isJoinedToTransaction() {
        return delegate.isJoinedToTransaction();
    }

    public <T> T unwrap(Class<T> cls) {
        return delegate.unwrap(cls);
    }

    public Object getDelegate() {
        return delegate.getDelegate();
    }

    public void close() {
        delegate.close();
    }

    public boolean isOpen() {
        return delegate.isOpen();
    }

    public EntityTransaction getTransaction() {
        return delegate.getTransaction();
    }

    public EntityManagerFactory getEntityManagerFactory() {
        return delegate.getEntityManagerFactory();
    }

    public CriteriaBuilder getCriteriaBuilder() {
        return delegate.getCriteriaBuilder();
    }

    public Metamodel getMetamodel() {
        return delegate.getMetamodel();
    }

    public <T> EntityGraph<T> createEntityGraph(Class<T> rootType) {
        return delegate.createEntityGraph(rootType);
    }

    public EntityGraph<?> createEntityGraph(String graphName) {
        return delegate.createEntityGraph(graphName);
    }

    public EntityGraph<?> getEntityGraph(String graphName) {
        return delegate.getEntityGraph(graphName);
    }

    public <T> List<EntityGraph<? super T>> getEntityGraphs(Class<T> entityClass) {
        return delegate.getEntityGraphs(entityClass);
    }
}
