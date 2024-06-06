package com.itdobler.oss.halma.common.db;

import com.itdobler.oss.halma.common.entity.AbstractEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class Db {

    private final EntityManager em;

    public Db(EntityManager em) {
        this.em = em;
    }

    public <Entity extends AbstractEntity<?>> void persist(Entity entity) {
        em.persist(entity);
    }

//    public <Entity extends AbstractEntity<UUID>> Entity find(ID<Entity> id) {
//        return em.find(id.getEntityClazz(), id.getId());
//    }
}
