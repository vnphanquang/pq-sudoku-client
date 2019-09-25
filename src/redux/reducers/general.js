import { 
  InitState,
  TOGGLE_DRAWER,
  TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE,
  GENERAL_SETTINGS,
} from '../actions/general';

export default function general(state = InitState, {type, payload}) {
  switch (type) {
    case TOGGLE_DRAWER:
      return { 
        ...state,
        drawerOpen: payload === undefined ? !state.drawerOpen : payload
      };
    case TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE:
      return {
        ...state,
        saveAsPromptOnTabClose: payload === undefined ? !state.saveAsPromptOnTabClose : payload
      }
    case GENERAL_SETTINGS:
      return payload;
    default:
      return state;
  }
}