package com.itdobler.oss.halma.common.types.id;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.fasterxml.jackson.databind.deser.ContextualKeyDeserializer;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.deser.std.StdKeyDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.NotImplementedException;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.io.Serial;
import java.util.UUID;

import static java.util.Objects.requireNonNull;

@UtilityClass
public class IDConverter {

    public static void registerJackson(SimpleModule module) {
        module.addSerializer(ID.class, new IDerializer());
        module.addKeySerializer(ID.class, new IDKeySerializer());
        module.addDeserializer(ID.class, new IDDeserializer());
        module.addKeyDeserializer(ID.class, new IDKeyDeserializer());
    }

    @SuppressWarnings("rawtypes")
    public static class IDerializer extends StdSerializer<ID> {
        @Serial
        private static final long serialVersionUID = -5605146384696304927L;

        protected IDerializer() {
            super(ID.class);
        }

        @Override
        public void serialize(@Nullable ID value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
            if (value == null) {
                return;
            }

            gen.writeString(String.valueOf(value.getUUID()));
        }
    }

    @SuppressWarnings("rawtypes")
    public static class IDKeySerializer extends StdSerializer<ID> {
        @Serial
        private static final long serialVersionUID = -5605146384696304927L;

        protected IDKeySerializer() {
            super(ID.class);
        }

        @Override
        public void serialize(@Nullable ID value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
            if (value == null) {
                return;
            }

            gen.writeFieldName(String.valueOf(value.getUUID()));
        }
    }

    public static class IDDeserializer extends StdDeserializer<ID<? extends AbstractEntity<?>>>
        implements ContextualDeserializer {
        @Serial
        private static final long serialVersionUID = -2453994657477625250L;

        @SuppressWarnings("rawtypes")
        private Class<? extends AbstractEntity> entityClass = null;

        public IDDeserializer() {
            super(ID.class);
        }

        public IDDeserializer(Class<? extends AbstractEntity<?>> entityClass) {
            super(ID.class);

            this.entityClass = entityClass;
        }

        @Override
        public @Nullable ID<?> deserialize(
            JsonParser jsonParser,
            DeserializationContext deserializationContext
        ) throws IOException {
            requireNonNull(entityClass);

            String id = jsonParser.getValueAsString();

            if (id == null) {
                return null;
            }

            @SuppressWarnings("unchecked")
            var result = ID.of(UUID.fromString(id), entityClass);

            return result;
        }

        @Override
        public JsonDeserializer<?> createContextual(
            DeserializationContext ctxt,
            BeanProperty property
        ) {
            var idContentClass = property.getType()
                .getBindings()
                .getTypeParameters()
                .get(0)
                .getRawClass();

            @SuppressWarnings("unchecked")
            Class<? extends AbstractEntity<?>> parsedEntityClass = (Class<? extends AbstractEntity<?>>) idContentClass;

            return new IDDeserializer(parsedEntityClass);
        }
    }

    public static class IDKeyDeserializer extends StdKeyDeserializer
        implements ContextualKeyDeserializer {
        @Serial
        private static final long serialVersionUID = -2453994657477625250L;

        @SuppressWarnings("rawtypes")
        private Class<? extends AbstractEntity> entityClass = null;

        public IDKeyDeserializer() {
            super(TYPE_CHAR, ID.class);
        }

        public IDKeyDeserializer(Class<? extends AbstractEntity<?>> entityClass) {
            super(TYPE_CHAR, ID.class);

            this.entityClass = entityClass;
        }

        @Override
        public @Nullable ID<?> deserializeKey(
            String key, DeserializationContext ctxt
        ) {
            requireNonNull(entityClass);

            throw new NotImplementedException("Not yet implemented, " + key);

            // The following should work but is yet untested
            // When activating, please also check if entityClass is of the correct type!
            //
            // @SuppressWarnings("UnnecessaryLocalVariable")
            // String id = key;
            //
            // if (id == null) {
            //     return null;
            // }
            //
            // @SuppressWarnings("unchecked")
            // ID<?> result = ID.parse(id, entityClass);
            //
            // return result;
        }

        @Override
        public IDKeyDeserializer createContextual(
            DeserializationContext ctxt,
            BeanProperty property
        ) {
            var idContentClass = property.getType()
                .getBindings()
                .getTypeParameters()
                .get(0)
                .getRawClass();

            @SuppressWarnings("unchecked")
            Class<? extends AbstractEntity<?>> parsedEntityClass = (Class<? extends AbstractEntity<?>>) idContentClass;

            return new IDKeyDeserializer(parsedEntityClass);
        }
    }

}
