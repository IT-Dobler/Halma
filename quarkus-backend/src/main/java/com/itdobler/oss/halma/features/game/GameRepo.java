package com.itdobler.oss.halma.features.game;

import com.itdobler.oss.halma.common.db.Db;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
@RequiredArgsConstructor
public class GameRepo {
    private final Db db;

    public void create(Game game) {
        db.persist(game);
    }

}
