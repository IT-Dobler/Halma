package com.itdobler.oss.halma.common.abstractentity;

import com.itdobler.oss.halma.common.types.id.ID;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.OffsetDateTime;

@EntityListeners(AbstractEntityListener.class)
@MappedSuperclass
@Getter
@Setter
public abstract class AbstractEntity<Entity extends AbstractEntity<Entity>> implements Serializable {

    @Serial
    private static final long serialVersionUID = -8605349806917752700L;

    public abstract ID<Entity> getId();

    public abstract Entity setId(ID<Entity> id);

    @Version
    @Column(nullable = false)
    // No validation: It's managed by the JPA
    private long version;

    @Column(nullable = false, updatable = false)
    // @Schema(type = SchemaType.STRING, format = Format.DATE_TIME, implementation = String.class)  TODO Yanic see if this is really needed :)
    private OffsetDateTime created_on;

    @Column(nullable = false, updatable = false)
    // @Schema(type = SchemaType.STRING, format = Format.DATE_TIME, implementation = String.class)  TODO Yanic see if this is really needed :)
    private OffsetDateTime changed_on;
}
