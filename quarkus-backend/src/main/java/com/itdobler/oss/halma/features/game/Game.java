package com.itdobler.oss.halma.features.game;

import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import com.itdobler.oss.halma.common.types.id.ID;
import com.itdobler.oss.halma.common.types.id.IDType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Getter
@Setter
public class Game extends AbstractEntity<Game> {

    @Id
    @Column(nullable = false, updatable = false)
    @Type(IDType.class)
    private ID<Game> id = ID.random(Game.class);


    private String code;
}
