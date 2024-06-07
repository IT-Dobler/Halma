package com.itdobler.oss.halma.common.types.id;

import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import com.itdobler.oss.halma.common.openapi.OpenApiConst.Format;
import lombok.Getter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.hibernate.annotations.Type;
import org.jetbrains.annotations.Nullable;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import static java.util.Objects.requireNonNull;

@Schema(
    type = SchemaType.STRING,
    format = Format.ENTITY_ID,
    implementation = UUID.class,
    example = "11111111-1111-1111-1111-111111111111"
)
public class ID<T extends AbstractEntity<T>> implements Serializable {

    @Serial
    private static final long serialVersionUID = -1883917014261331377L;

    @Type(IDType.class)
    private final UUID uuid;

    @Getter
    private final Class<T> entityClazz;

    private ID(UUID id, Class<T> entityClazz) {
        this.uuid = requireNonNull(id);
        this.entityClazz = requireNonNull(entityClazz);
    }

    public static <T extends AbstractEntity<T>> ID<T> of(
        UUID uuid,
        Class<T> entityClass
    ) {
        return new ID<>(uuid, entityClass);
    }

    public static <T extends AbstractEntity<T>> ID<T> parse(
        String uuid,
        Class<T> entityClazz
    ) {
        Objects.requireNonNull(uuid);

        var result = of(UUID.fromString(uuid), entityClazz);

        return result;
    }

    public static <T extends AbstractEntity<T>> ID<T> random(Class<T> entityClass) {
        return new ID<>(UUID.randomUUID(), entityClass);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
            .append(uuid)
            .append(entityClazz.getSimpleName())
            .toString();
    }

    @Override
    public boolean equals(@Nullable Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || !getClass().equals(o.getClass())) {
            return false;
        }

        ID<?> id = (ID<?>) o;

        return Objects.equals(uuid, id.uuid) && Objects.equals(entityClazz, id.entityClazz);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uuid, entityClazz);
    }

    public UUID getUUID() {
        return uuid;
    }

}
