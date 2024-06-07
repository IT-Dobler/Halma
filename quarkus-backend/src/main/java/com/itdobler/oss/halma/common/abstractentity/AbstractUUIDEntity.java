package com.itdobler.oss.halma.common.abstractentity;

import com.itdobler.oss.halma.common.types.id.IDType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

import java.util.UUID;

@MappedSuperclass
public abstract class AbstractUUIDEntity<Entity extends AbstractUUIDEntity<Entity>> extends AbstractEntity<UUID> {

    @Id
    @Column(nullable = false, updatable = false, length = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Type(IDType.class)
    private UUID id;
}
