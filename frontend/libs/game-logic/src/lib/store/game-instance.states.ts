import { EntityState } from '@reduxjs/toolkit';
import { NodeEntity } from '../model/node-entity';
import { GAME_INSTANCE_FEATURE_KEY, GameInstanceState } from 'game-logic';
import { PlayerEntity } from '../model/player-entity';
import { CurrentMove } from '../model/current-move';
import { GameConfig } from '../model/game-config';

export const getGameInstanceState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): GameInstanceState => rootState[GAME_INSTANCE_FEATURE_KEY];
export const getGameStateState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): EntityState<NodeEntity> => rootState[GAME_INSTANCE_FEATURE_KEY].gameState;
export const getPlayersState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): EntityState<PlayerEntity> => rootState[GAME_INSTANCE_FEATURE_KEY].players;
export const getCurrentMoveState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): CurrentMove => rootState[GAME_INSTANCE_FEATURE_KEY].currentMove;
export const getGameConfigState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): GameConfig => rootState[GAME_INSTANCE_FEATURE_KEY].config;
