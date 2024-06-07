package com.itdobler.oss.halma.common.types.id;

import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import jakarta.ws.rs.ext.ParamConverter;
import jakarta.ws.rs.ext.ParamConverterProvider;
import jakarta.ws.rs.ext.Provider;
import org.jetbrains.annotations.Nullable;

import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.UUID;

import static java.util.Objects.requireNonNull;

@Provider
@SuppressWarnings("unused")
class IDParamConverterProvider implements ParamConverterProvider {

    @Override
    @SuppressWarnings("unchecked")
    public <T> @Nullable ParamConverter<T> getConverter(
        Class<T> rawType,
        Type genericType,
        Annotation[] annotations
    ) {
        if (!rawType.equals(ID.class)) {
            return null;
        }
        if (!(genericType instanceof ParameterizedType type)) {
            throw new IllegalStateException(ID.class.getSimpleName()
                + " needs a type parameter (e.g.: ID<SomeEntity>) but was used without (i.e.: as a raw type)!");
        }
        // now, type is the concrete generic type of ID, e.g.: ID<SomeEntity>
        if (type.getActualTypeArguments().length != 1) {
            throw new IllegalArgumentException(
                "This implementation expected ID to have exactly one type argument, e.g.: ID<SomeEntity>."
                    + " Actual declaraiton: " + genericType);
        }

        var typeArgument = type.getActualTypeArguments()[0];

        Class<? extends AbstractEntity<?>> entityClass = typeArgument instanceof ParameterizedType
            ? (Class<? extends AbstractEntity<?>>) ((ParameterizedType) typeArgument).getRawType()
            : (Class<? extends AbstractEntity<?>>) typeArgument;

        ParamConverter<T> result = (ParamConverter<T>) new IDParamConverter(entityClass);

        return result;
    }

    private static final class IDParamConverter implements ParamConverter<ID<?>> {
        @SuppressWarnings("rawtypes")
        private final Class<? extends AbstractEntity> entityClass;

        private IDParamConverter(Class<? extends AbstractEntity<?>> entityClass) {
            this.entityClass = requireNonNull(entityClass);
        }

        @Override
        public @Nullable ID<?> fromString(String value) {
            if (value == null) {
                return null;
            }

            @SuppressWarnings("unchecked")
            ID<?> id = ID.of(UUID.fromString(value), entityClass);
            return id;
        }

        @Override
        public @Nullable String toString(ID<?> value) {
            if (value == null) {
                return null;
            }

            return value.getUUID().toString();
        }
    }

}
