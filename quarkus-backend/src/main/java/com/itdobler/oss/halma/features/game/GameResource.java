package com.itdobler.oss.halma.features.game;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
@Transactional
@RequiredArgsConstructor(onConstructor_ = @Inject)
@Path("/game")
public class GameResource {

    private final GameService gameService;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void createGame(Game game) {
        gameService.createGame(game);
    }
}
