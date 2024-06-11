package com.itdobler.oss.halma.common.db;

import com.mysema.commons.lang.CloseableIterator;
import com.querydsl.core.*;
import com.querydsl.core.types.*;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.BooleanOperation;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.LockModeType;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static java.util.Optional.ofNullable;

/**
 * A wrapper around {@link JPAQuery} that helps with factory methods and a single interface in case the QueryDSL API changes.
 */
@SuppressWarnings({ "NonBooleanMethodNameMayNotStartWithQuestion", "unused", "OverloadedVarargsMethod" })
public class SmartJPAQuery<T> {
    private final JPAQuery<T> delegate;

    public SmartJPAQuery(JPAQuery<T> delegate) {
        this.delegate = delegate;
    }

    public SubQueryExpression<T> asSubQuery() {
        return delegate;
    }

    public <U> SmartJPAQuery<U> select(Expression<U> expr) {
        return new SmartJPAQuery<>(delegate.select(expr));
    }

    public SmartJPAQuery<Tuple> select(Expression<?>... exprs) {
        return new SmartJPAQuery<>(delegate.select(exprs));
    }

    public CloseableIterator<T> iterate() {
        return delegate.iterate();
    }

    public Stream<T> stream() {
        return delegate.stream();
    }

    public List<T> fetch() {
        return delegate.fetch();
    }

    public Optional<T> fetchOne() throws NonUniqueResultException {
        return ofNullable(delegate.fetchOne());
    }

    public SmartJPAQuery<T> setLockMode(LockModeType lockMode) {
        return new SmartJPAQuery<>(delegate.setLockMode(lockMode));
    }

    public SmartJPAQuery<T> setFlushMode(FlushModeType flushMode) {
        return new SmartJPAQuery<>(delegate.setFlushMode(flushMode));
    }

    public SmartJPAQuery<T> setHint(String name, Object value) {
        return new SmartJPAQuery<>(delegate.setHint(name, value));
    }

    public SmartJPAQuery<T> fetchJoin() {
        return new SmartJPAQuery<>(delegate.fetchJoin());
    }

    public SmartJPAQuery<T> from(EntityPath<?> arg) {
        return new SmartJPAQuery<>(delegate.from(arg));
    }

    public SmartJPAQuery<T> from(EntityPath<?>... args) {
        return new SmartJPAQuery<>(delegate.from(args));
    }

    public <P> SmartJPAQuery<T> from(CollectionExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.from(target, alias));
    }

    public <P> SmartJPAQuery<T> innerJoin(CollectionExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.innerJoin(target));
    }

    public <P> SmartJPAQuery<T> innerJoin(CollectionExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.innerJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> innerJoin(EntityPath<P> target) {
        return new SmartJPAQuery<>(delegate.innerJoin(target));
    }

    public <P> SmartJPAQuery<T> innerJoin(EntityPath<P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.innerJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> innerJoin(MapExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.innerJoin(target));
    }

    public <P> SmartJPAQuery<T> innerJoin(MapExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.innerJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> join(CollectionExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.join(target));
    }

    public <P> SmartJPAQuery<T> join(CollectionExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.join(target, alias));
    }

    public <P> SmartJPAQuery<T> join(EntityPath<P> target) {
        return new SmartJPAQuery<>(delegate.join(target));
    }

    public <P> SmartJPAQuery<T> join(EntityPath<P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.join(target, alias));
    }

    public <P> SmartJPAQuery<T> join(MapExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.join(target));
    }

    public <P> SmartJPAQuery<T> join(MapExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.join(target, alias));
    }

    public <P> SmartJPAQuery<T> leftJoin(CollectionExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.leftJoin(target));
    }

    public <P> SmartJPAQuery<T> leftJoin(CollectionExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.leftJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> leftJoin(EntityPath<P> target) {
        return new SmartJPAQuery<>(delegate.leftJoin(target));
    }

    public <P> SmartJPAQuery<T> leftJoin(EntityPath<P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.leftJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> leftJoin(MapExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.leftJoin(target));
    }

    public <P> SmartJPAQuery<T> leftJoin(MapExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.leftJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> rightJoin(CollectionExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.rightJoin(target));
    }

    public <P> SmartJPAQuery<T> rightJoin(CollectionExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.rightJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> rightJoin(EntityPath<P> target) {
        return new SmartJPAQuery<>(delegate.rightJoin(target));
    }

    public <P> SmartJPAQuery<T> rightJoin(EntityPath<P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.rightJoin(target, alias));
    }

    public <P> SmartJPAQuery<T> rightJoin(MapExpression<?, P> target) {
        return new SmartJPAQuery<>(delegate.rightJoin(target));
    }

    public <P> SmartJPAQuery<T> rightJoin(MapExpression<?, P> target, Path<P> alias) {
        return new SmartJPAQuery<>(delegate.rightJoin(target, alias));
    }

    public SmartJPAQuery<T> on(Predicate condition) {
        return new SmartJPAQuery<>(delegate.on(condition));
    }

    public SmartJPAQuery<T> on(Predicate... conditions) {
        return new SmartJPAQuery<>(delegate.on(conditions));
    }

    @Override
    public String toString() {
        return delegate.toString();
    }

    public BooleanExpression contains(Expression<? extends T> right) {
        return delegate.contains(right);
    }

    public BooleanExpression contains(T constant) {
        return delegate.contains(constant);
    }

    public BooleanExpression exists() {
        return delegate.exists();
    }

    public BooleanExpression eq(Expression<? extends T> expr) {
        return delegate.eq(expr);
    }

    public BooleanExpression eq(T constant) {
        return delegate.eq(constant);
    }

    public BooleanExpression ne(Expression<? extends T> expr) {
        return delegate.ne(expr);
    }

    public BooleanExpression ne(T constant) {
        return delegate.ne(constant);
    }

    public BooleanExpression notExists() {
        return delegate.notExists();
    }

    public BooleanExpression lt(Expression<? extends T> expr) {
        return delegate.lt(expr);
    }

    public BooleanExpression lt(T constant) {
        return delegate.lt(constant);
    }

    public BooleanExpression gt(Expression<? extends T> expr) {
        return delegate.gt(expr);
    }

    public BooleanExpression gt(T constant) {
        return delegate.gt(constant);
    }

    public BooleanExpression loe(Expression<? extends T> expr) {
        return delegate.loe(expr);
    }

    public BooleanExpression loe(T constant) {
        return delegate.loe(constant);
    }

    public BooleanExpression goe(Expression<? extends T> expr) {
        return delegate.goe(expr);
    }

    public BooleanExpression goe(T constant) {
        return delegate.goe(constant);
    }

    public BooleanOperation isNull() {
        return delegate.isNull();
    }

    public BooleanOperation isNotNull() {
        return delegate.isNotNull();
    }

    public Class<T> getType() {
        return delegate.getType();
    }

    public BooleanExpression in(Collection<? extends T> right) {
        return delegate.in(right);
    }

    @SuppressWarnings("varargs")
    @SafeVarargs
    public final BooleanExpression in(T... right) {
        return delegate.in(right);
    }

    public <T1> T1 transform(ResultTransformer<T1> transformer) {
        return delegate.transform(transformer);
    }

    public SmartJPAQuery<T> distinct() {
        return new SmartJPAQuery<>(delegate.distinct());
    }

    public SmartJPAQuery<T> groupBy(Expression<?> e) {
        return new SmartJPAQuery<>(delegate.groupBy(e));
    }

    public SmartJPAQuery<T> groupBy(Expression<?>... o) {
        return new SmartJPAQuery<>(delegate.groupBy(o));
    }

    public SmartJPAQuery<T> having(Predicate e) {
        return new SmartJPAQuery<>(delegate.having(e));
    }

    public SmartJPAQuery<T> having(Predicate... o) {
        return new SmartJPAQuery<>(delegate.having(o));
    }

    public SmartJPAQuery<T> orderBy(OrderSpecifier<?> o) {
        return new SmartJPAQuery<>(delegate.orderBy(o));
    }

    public SmartJPAQuery<T> orderBy(OrderSpecifier<?>... o) {
        return new SmartJPAQuery<>(delegate.orderBy(o));
    }

    public SmartJPAQuery<T> where(Predicate o) {
        return new SmartJPAQuery<>(delegate.where(o));
    }

    public SmartJPAQuery<T> where(Predicate... o) {
        return new SmartJPAQuery<>(delegate.where(o));
    }

    public SmartJPAQuery<T> limit(long limit) {
        return new SmartJPAQuery<>(delegate.limit(limit));
    }

    public SmartJPAQuery<T> offset(long offset) {
        return new SmartJPAQuery<>(delegate.offset(offset));
    }

    public SmartJPAQuery<T> restrict(QueryModifiers modifiers) {
        return new SmartJPAQuery<>(delegate.restrict(modifiers));
    }

    public <P> SmartJPAQuery<T> set(ParamExpression<P> param, P value) {
        return new SmartJPAQuery<>(delegate.set(param, value));
    }

    public T fetchFirst() {
        return delegate.fetchFirst();
    }

    public QueryMetadata getMetadata() {
        return delegate.getMetadata();
    }

    public SmartJPAQuery<T> applyEntityGraph(EntityGraph<?> entityGraph) {
        return new SmartJPAQuery<>(delegate.setHint("jakarta.persistence.fetchgraph", entityGraph));
    }
}
