package com.itdobler.oss.halma.features.game;

import com.itdobler.oss.halma.common.abstractentity.AbstractEntity;
import com.itdobler.oss.halma.common.db.DbConst;
import com.itdobler.oss.halma.common.types.id.ID;
import com.itdobler.oss.halma.common.types.id.IDType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "game")
@Getter
@Setter
public class Game extends AbstractEntity<Game> {

    @Id
    @Column(nullable = false, updatable = false)
    @Type(IDType.class)
    private ID<Game> id = ID.random(Game.class);

    @NotNull
    @Size(max = DbConst.DB_DEFAULT_MAX_LENGTH)
    @Column(nullable = false, updatable = false)
    private String code;
}
