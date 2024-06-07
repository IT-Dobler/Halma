package com.itdobler.oss.halma.common.types.id;

import org.hibernate.HibernateException;
import org.hibernate.annotations.common.reflection.java.JavaXMember;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.type.SqlTypes;
import org.hibernate.usertype.DynamicParameterizedType;
import org.hibernate.usertype.EnhancedUserType;
import org.jetbrains.annotations.Nullable;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;

import static java.util.Objects.requireNonNull;

@SuppressWarnings("rawtypes")
public class IDType implements EnhancedUserType<ID>, DynamicParameterizedType {

    private Class entityClass = null;

    @Override
    public void setParameterValues(Properties parameters) {
        // Hibernate insists on using a HashTable :(
        @SuppressWarnings("UseOfPropertiesAsHashtable")
        JavaXMember member = (JavaXMember) parameters.get(DynamicParameterizedType.XPROPERTY);

        ParameterType pt = (ParameterType) parameters.get(DynamicParameterizedType.PARAMETER_TYPE);

        boolean isRunningOnBrokenEnvers = member == null && pt.getTable().endsWith("_AUD");
        if (isRunningOnBrokenEnvers) {
            this.entityClass =
                    parseEntityClassFromEntityNameEvilHack(parameters.getProperty(DynamicParameterizedType.ENTITY));
            return;
        }

        requireNonNull(member, "Hibernate did not provide the generic type parameter :(");

        entityClass = new EntityClassNameParser(ID.class)
                .entityClassFrom(member.getJavaType());
    }

    private Class<?> parseEntityClassFromEntityNameEvilHack(String className) {
        try {
            return Class.forName(className);
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("Could not load class: " + className, e);
        }
    }

    @Override
    public int getSqlType() {
        return SqlTypes.UUID;
    }

    @Override
    public Class<ID> returnedClass() {
        return ID.class;
    }

    @Override
    public boolean equals(ID x, ID y) {
        return Objects.equals(x, y);
    }

    @Override
    public int hashCode(ID x) {
        return x.hashCode();
    }

    @Override
    public @Nullable ID nullSafeGet(
            ResultSet rs,
            int position,
            SharedSessionContractImplementor session,
            Object owner
    ) throws SQLException {
        var value = (UUID) rs.getObject(position);
        if (value == null) {
            return null;
        }

        @SuppressWarnings("unchecked")
        ID result = ID.of(value, entityClass);

        return result;
    }

    @Override
    public void nullSafeSet(PreparedStatement st, ID value, int index, SharedSessionContractImplementor session)
            throws SQLException {
        if (value == null) {
            st.setObject(index, null);
            return;
        }
        st.setObject(index, value.getUUID());
    }

    @Override
    public ID deepCopy(ID value) {
        @SuppressWarnings("unchecked")
        ID result = ID.of(value.getUUID(), value.getEntityClazz());
        return result;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(ID value) {
        return value;
    }

    @Override
    public ID assemble(Serializable cached, Object owner) {
        return (ID) cached;
    }

    @Override
    public String toSqlLiteral(ID value) {
        return String.format(Locale.ROOT, "'%s'", value.getUUID().toString());
    }

    @Override
    public String toString(ID value) throws HibernateException {
        return value.getUUID().toString();
    }

    @Override
    public ID fromStringValue(CharSequence sequence) throws HibernateException {
        var uuid = UUID.fromString(sequence.toString());

        @SuppressWarnings("unchecked")
        ID id = ID.of(uuid, entityClass);

        return id;
    }
}
