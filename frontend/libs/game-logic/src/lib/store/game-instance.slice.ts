import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { GameInitUtil } from '../game-init.util';
import {
  directionOfInit,
  directionsOfPlay,
  PlayDirection,
} from '../model/play-direction';
import { playerColors } from '../model/player-color';
import { gameInstanceReducers } from './game-instance.reducers';
import { GameConfig, GameConfigUtil } from '../model/game-config';
import { CurrentMove } from '../model/current-move';
import { NodeEntity } from '../model/node-entity';
import { PlayerEntity } from '../model/player-entity';
import { GameInstanceTS } from '../model/game-instance';
import {
  getCurrentMoveState,
  getGameConfigState,
  getGameInstanceState,
  getGameStateState,
  getPlayersState,
} from './game-instance.states';
import { GameTypeTS } from '../model/game-type';
import { PositionUtil } from '../position-util';

export const GAME_INSTANCE_FEATURE_KEY = 'gameInstance';

export interface GameInstanceState {
  gameState: EntityState<NodeEntity>;
  players: EntityState<PlayerEntity>;
  config: GameConfig;
  possibleMovesId: string[];
  currentMove: CurrentMove;

  isWon: boolean;
  stepCounter: number; // TODO Only a rudimentary first "stat", big overhaul coming

  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
}

export const gameStateAdapter = createEntityAdapter<NodeEntity>();
export const playersAdapter = createEntityAdapter<PlayerEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchGameInstance())
 * }, [dispatch]);
 * ```
 */
export const fetchGameInstance = createAsyncThunk(
  'gameInstance/fetchStatus',
  async () => {
    // Default settings TODO obviously needs work :)
    const config: GameConfig = {
      cornerSize: 2,
      height: 11,
      // width has a max of 26, otherwise we run out of Alphabet. SHOULD never be relevant.
      width: 11,
      gameType: GameTypeTS.CLAUDIO,
      playersId: ['1'],
      hasRotatingBoard: false,
    };

    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getGameInstances()`;
     * Right now we just return an empty array.
     */

    const players: PlayerEntity[] = [];
    for (let i = 0; i < config.playersId.length; i++) {
      const id = config.playersId[i];
      players.push({
        id: id,
        color: playerColors[i],
        playDirection: directionOfInit[i],
      });
    }

    /**
     * One day we will load the game from server side under certain conditions.
     * For now, we just receive some basic parameters and pass on something
     */
    const nodes: Record<EntityId, NodeEntity> = GameInitUtil.initBoard(config);
    GameInitUtil.initBlockedPositions(nodes, config);
    GameInitUtil.initPieces(nodes, players, config);

    const currentMove: CurrentMove = {
      playerIdToMove: players[0].id,
      playDirection: directionsOfPlay[0],
    };

    return Promise.resolve({
      players,
      nodes,
      config,
      currentMove,
    });
  },
);

export const initialGameInstanceState: GameInstanceState = {
  gameState: gameStateAdapter.getInitialState(),
  players: playersAdapter.getInitialState(),
  config: GameConfigUtil.getInitialState(),
  possibleMovesId: [],
  currentMove: {
    playerIdToMove: '',
    playDirection: PlayDirection.BOTTOM_TO_TOP,
  },

  isWon: false,
  stepCounter: 0,

  loadingStatus: 'not loaded',
  error: null,
};

export const gameInstanceSlice = createSlice({
  name: GAME_INSTANCE_FEATURE_KEY,
  initialState: initialGameInstanceState,
  reducers: {
    // init: gameStateAdapter.addOne
    // ...
    clickPiece: gameInstanceReducers.clickPiece,
    clickDestination: gameInstanceReducers.clickDestination,
    nextTurn: gameInstanceReducers.nextTurn,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameInstance.pending, (state: GameInstanceState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchGameInstance.fulfilled,
        (state: GameInstanceState, action: PayloadAction<GameInstanceTS>) => {
          gameStateAdapter.setAll(state.gameState, action.payload.nodes);
          playersAdapter.setAll(state.players, action.payload.players);
          state.config = action.payload.config;
          state.currentMove = action.payload.currentMove;
          state.isWon = false;
          state.stepCounter = 0;
          state.loadingStatus = 'loaded';
        },
      )
      .addCase(
        fetchGameInstance.rejected,
        (state: GameInstanceState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        },
      );
  },
});

/*
 * Export reducer for store configuration.
 */
export const gameInstanceReducer = gameInstanceSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(gameInstanceActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const gameInstanceActions = gameInstanceSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllGameInstance);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
// Non memoized selectors
const { selectIds, selectById } = gameStateAdapter.getSelectors();

const _selectPlayerById = playersAdapter.getSelectors().selectById;
// Memoized selectors
export const selectAllGameStateIds = createSelector(
  getGameStateState,
  selectIds,
);
export const selectAllPlayerIds = createSelector(
    getPlayersState,
    playersAdapter.getSelectors().selectIds
)
export const selectNodeById = (id: EntityId) =>
  createSelector([getGameStateState], (state) => selectById(state, id));

export const selectPlayerById = (id: EntityId | undefined) =>
  createSelector([getPlayersState], (state) =>
    id ? _selectPlayerById(state, id) : undefined,
  );
export const selectCurrentMove = createSelector(
  [getCurrentMoveState],
  (state) => state,
);

export const selectCanEndTurn = createSelector(
  [getGameInstanceState],
  (state) =>
    state.currentMove.lastMovedNodeId !== undefined &&
    !PositionUtil.getNoParkingNodeIds(
      state.config,
      state.currentMove.playDirection,
    ).includes(state.currentMove.lastMovedNodeId) &&
    state.currentMove.initiallySelectedNodeId !==
      state.currentMove.lastMovedNodeId,
);

export const selectGameConfig = createSelector(
  [getGameConfigState],
  (state) => state,
);

export const selectIsWon = createSelector(
  getGameInstanceState,
  (state) => state.isWon,
);

export const selectStepCounter = createSelector(
  getGameInstanceState,
  (state) => state.stepCounter,
);
