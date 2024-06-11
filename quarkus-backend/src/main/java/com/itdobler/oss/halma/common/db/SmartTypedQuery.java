package com.itdobler.oss.halma.common.db;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.*;

import static java.util.Objects.requireNonNull;

/**
 * Wraps a TypedQuery and provides some convenience methods.
 * The primary usage of this method is future proofing the codebase against changes in the JPA API.
 * Also adds lots of null-safety checks.
 */
@SuppressWarnings({ "unused" })
public class SmartTypedQuery<X> implements TypedQuery<X> {

    private final TypedQuery<X> delegate;

    public SmartTypedQuery(@NotNull TypedQuery<X> delegate) {
        this.delegate = requireNonNull(delegate);
    }

    /**
     * Returns a Non-Null (in SQL- *and* Java-sense) result!
     * <p>
     * Is therefore not suitable if the SQL query returns a result with Value null!
     */
    @NotNull
    public Optional<@NotNull X> getSingleResultOpt() {
        try {
            return Optional.of(delegate.getSingleResult());
        } catch (NoResultException ignored) {
            return Optional.empty();
        }
    }

    @Override
    @NotNull
    public List<@NotNull X> getResultList() {
        return delegate.getResultList();
    }

    @Override
    @Nullable
    public X getSingleResult() {
        return delegate.getSingleResult();
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setHint(@NotNull String hintName, @Nullable Object value) {
        return new SmartTypedQuery<>(delegate.setHint(hintName, value));
    }

    @Override
    public <T> @NotNull SmartTypedQuery<X> setParameter(@NotNull Parameter<T> param, @Nullable T value) {
        return new SmartTypedQuery<>(delegate.setParameter(param, value));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        @NotNull Parameter<Calendar> param,
        @Nullable Calendar value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(param, value, temporalType));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        @NotNull Parameter<Date> param,
        @Nullable Date value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(param, value, temporalType));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(@NotNull String name, @Nullable Object value) {
        return new SmartTypedQuery<>(delegate.setParameter(name, value));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        @NotNull String name,
        @Nullable Calendar value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(name, value, temporalType));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        @NotNull String name,
        @Nullable Date value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(name, value, temporalType));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(int position, @Nullable Object value) {
        return new SmartTypedQuery<>(delegate.setParameter(position, value));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        int position,
        @Nullable Calendar value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(position, value, temporalType));
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setParameter(
        int position,
        @Nullable Date value,
        @NotNull TemporalType temporalType
    ) {
        return new SmartTypedQuery<>(delegate.setParameter(position, value, temporalType));
    }

    @Override
    public int executeUpdate() {
        return delegate.executeUpdate();
    }

    @Override
    public int getMaxResults() {
        return delegate.getMaxResults();
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setMaxResults(int maxResult) {
        return new SmartTypedQuery<>(delegate.setMaxResults(maxResult));
    }

    @Override
    public int getFirstResult() {
        return delegate.getFirstResult();
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setFirstResult(int startPosition) {
        return new SmartTypedQuery<>(delegate.setFirstResult(startPosition));
    }

    @Override
    @NotNull
    public Map<@NotNull String, @Nullable Object> getHints() {
        return delegate.getHints();
    }

    @Override
    @NotNull
    public Set<@NotNull Parameter<?>> getParameters() {
        return delegate.getParameters();
    }

    @Override
    @NotNull
    public Parameter<?> getParameter(@NotNull String name) {
        return delegate.getParameter(name);
    }

    @Override
    public <T> @NotNull Parameter<T> getParameter(@NotNull String name, @NotNull Class<T> type) {
        return delegate.getParameter(name, type);
    }

    @Override
    @NotNull
    public Parameter<?> getParameter(int position) {
        return delegate.getParameter(position);
    }

    @Override
    public <T> @NotNull Parameter<T> getParameter(int position, @NotNull Class<T> type) {
        return delegate.getParameter(position, type);
    }

    @Override
    public boolean isBound(@NotNull Parameter<?> param) {
        return delegate.isBound(param);
    }

    @Override
    public <T> T getParameterValue(@NotNull Parameter<T> param) {
        return delegate.getParameterValue(param);
    }

    @Override
    @Nullable
    public Object getParameterValue(@NotNull String name) {
        return delegate.getParameterValue(name);
    }

    @Override
    @Nullable
    public Object getParameterValue(int position) {
        return delegate.getParameterValue(position);
    }

    @Override
    @NotNull
    public FlushModeType getFlushMode() {
        return delegate.getFlushMode();
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setFlushMode(@NotNull FlushModeType flushMode) {
        return new SmartTypedQuery<>(delegate.setFlushMode(flushMode));
    }

    @Override
    @NotNull
    public LockModeType getLockMode() {
        return delegate.getLockMode();
    }

    @Override
    @NotNull
    public SmartTypedQuery<X> setLockMode(@NotNull LockModeType lockMode) {
        return new SmartTypedQuery<>(delegate.setLockMode(lockMode));
    }

    @Override
    public <T> @NotNull T unwrap(@NotNull Class<T> cls) {
        return delegate.unwrap(cls);
    }
}
