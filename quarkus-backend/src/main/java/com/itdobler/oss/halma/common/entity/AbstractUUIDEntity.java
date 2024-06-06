package com.itdobler.oss.halma.common.entity;

import jakarta.persistence.*;

import java.util.UUID;

@MappedSuperclass
public abstract class AbstractUUIDEntity<Entity extends AbstractUUIDEntity<Entity>> extends AbstractEntity<UUID> {

    @Id
    @Column(nullable = false, updatable = false, length = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
}
