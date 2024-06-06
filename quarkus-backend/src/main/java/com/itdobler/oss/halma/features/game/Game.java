package com.itdobler.oss.halma.features.game;

import com.itdobler.oss.halma.common.entity.AbstractUUIDEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Game extends AbstractUUIDEntity<Game> {
    private String code;
}
