package com.itdobler.oss.halma.features.game;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@ApplicationScoped
@RequiredArgsConstructor(onConstructor_ = @Inject)
@Slf4j
public class GameService {
    private final GameRepo gameRepo;

    public void createGame(Game game) {
        gameRepo.create(game);
    }
}
