import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { NodeTypeTS } from '../node-type';
import { GameTypeTS } from '../game-type';
import {
  getValidNodesId,
  initBlockedPositions,
  initBoard,
  initPieces,
} from '../game-instance.util';

export const GAME_INSTANCE_FEATURE_KEY = 'gameInstance';

export interface GameConfig {
  playersId: string[];
  gameType: GameTypeTS;
  width: number;
  height: number;
  cornerSize: number;
}

export interface GameInstanceDTO {
  nodes: Record<EntityId, NodeEntity>;
  players: PlayerEntity[];
  config: GameConfig;
}

export interface NodeEntity {
  id: string;
  type: NodeTypeTS;
  owningPlayerId?: string;
}

export interface PlayerEntity {
  id: string;
}

export interface GameInstanceState {
  gameState: EntityState<NodeEntity>;
  players: EntityState<PlayerEntity>;
  config: GameConfig;
  possibleMovesId: string[];

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
  async (config: GameConfig) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getGameInstances()`;
     * Right now we just return an empty array.
     */

    const players: PlayerEntity[] = [];
    for (let i = 0; i < 4; i++) {
      players.push({
        id: `playerid-${i}`,
      });
    }

    /**
     * One day we will load the game from server side under certain conditions.
     * For now, we just receive some basic parameters and pass on something
     */
    const nodes: Record<EntityId, NodeEntity> = initBoard(config);
    initBlockedPositions(nodes, config);
    initPieces(nodes, players, config);

    return Promise.resolve({
      players,
      nodes,
      config,
    });
  },
);

export const initialGameInstanceState: GameInstanceState = {
  gameState: gameStateAdapter.getInitialState(),
  players: playersAdapter.getInitialState(),
  config: {
    playersId: [],
    gameType: GameTypeTS.CLAUDIO,
    width: 0,
    height: 0,
    cornerSize: 0,
  },
  possibleMovesId: [],
  loadingStatus: 'not loaded',
  error: null,
};

export const gameInstanceSlice = createSlice({
  name: GAME_INSTANCE_FEATURE_KEY,
  initialState: initialGameInstanceState,
  reducers: {
    // init: gameStateAdapter.addOne
    // ...
    clickPiece: (state, action: PayloadAction<string>) => {
      const node = state.gameState.entities[action.payload]!;
      // node.type = NodeTypeTS.PIECE;
      // gameStateAdapter.setOne(state.gameState, node);

      // Check if we are allowed to select this node
      // if (state.currentMove.playerIdToMove !== action.payload.owningPlayerId) {
      //   return;
      // }

      // If we haven't selected a node, just select it.
      // if (node.type) {
      //   state.currentMove.selectedPiece = action.payload;
      //   return;
      // }

      // Clear possible moves
      for (const id of state.possibleMovesId) {
        state.gameState.entities[id]!.type = NodeTypeTS.EMPTY;
      }

      // Check whether we are clicking on the same node, deselect
      if (node.type === NodeTypeTS.SELECTED) {
        node.type = NodeTypeTS.PIECE;
      } else {
        // Deselect potentially other selected piece
        const selectedNode = Object.values(state.gameState.entities).find(
          (value) => value?.type === NodeTypeTS.SELECTED,
        );

        if (selectedNode) {
          selectedNode.type = NodeTypeTS.PIECE;
        }

        // Select the clicked node
        node.type = NodeTypeTS.SELECTED;

        const validNodesId = getValidNodesId(node.id, state);
        state.possibleMovesId = validNodesId;

        for (const id of validNodesId) {
          state.gameState.entities[id]!.type = NodeTypeTS.POSSIBLE_MOVE;
        }
      }

      // gameStateAdapter.setOne(state.gameState, node);

      // Otherwise just select the new node
      // state.currentMove.selectedPiece = action.payload;
    },
    clickDestination: (state, action: PayloadAction<string>) => {
      // Deselect selected piece
      const selectedNode = Object.values(state.gameState.entities).find(
        (value) => value?.type === NodeTypeTS.SELECTED,
      );

      if (selectedNode) {
        gameStateAdapter.updateOne(state.gameState, {
          id: selectedNode.id,
          changes: { type: NodeTypeTS.EMPTY },
        });
      }

      // Clear possible moves
      for (const id of state.possibleMovesId) {
        state.gameState.entities[id]!.type = NodeTypeTS.EMPTY;
      }

      // Select new piece
      gameStateAdapter.updateOne(state.gameState, {
        id: action.payload,
        changes: { type: NodeTypeTS.SELECTED },
      });

      const validNodesId = getValidNodesId(action.payload, state);
      state.possibleMovesId = validNodesId;

      gameStateAdapter.updateMany(
        state.gameState,
        validNodesId.map((id) => ({
          id: id,
          changes: { type: NodeTypeTS.POSSIBLE_MOVE },
        })),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameInstance.pending, (state: GameInstanceState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchGameInstance.fulfilled,
        (state: GameInstanceState, action: PayloadAction<GameInstanceDTO>) => {
          gameStateAdapter.setAll(state.gameState, action.payload.nodes);
          playersAdapter.setAll(state.players, action.payload.players);
          state.config = action.payload.config;
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
const { selectAll, selectEntities, selectIds, selectById } =
  gameStateAdapter.getSelectors(); // Non memoized selectors

export const getGameInstanceState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): GameInstanceState => rootState[GAME_INSTANCE_FEATURE_KEY];

export const getGameStateState = (rootState: {
  [GAME_INSTANCE_FEATURE_KEY]: GameInstanceState;
}): EntityState<NodeEntity> => rootState[GAME_INSTANCE_FEATURE_KEY].gameState;

export const selectAllGameState = createSelector(getGameStateState, selectAll);

export const selectAllGameStateIds = createSelector(
  getGameStateState,
  selectIds,
);
export const selectNodeById = (id: EntityId) =>
  createSelector([getGameStateState], (state) => selectById(state, id));

export const selectGameInstanceEntities = createSelector(
  getGameStateState,
  selectEntities,
);
