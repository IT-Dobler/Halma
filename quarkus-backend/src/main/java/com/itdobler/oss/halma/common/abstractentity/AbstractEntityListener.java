package com.itdobler.oss.halma.common.abstractentity;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.OffsetDateTime;

public class AbstractEntityListener {

    @PrePersist
    public void prePersist(AbstractEntity<?> entity) {
        OffsetDateTime now = OffsetDateTime.now();

        entity.setCreated_on(now);
        entity.setChanged_on(now);
    }

    @PreUpdate
    public void preUpdate(AbstractEntity<?> entity) {
        entity.setChanged_on(OffsetDateTime.now());
    }
}
