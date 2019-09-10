/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const ADD_TAB = 'ADD_TAB';
export const CHANGE_TAB = 'CHANGE_TAB';
export const REMOVE_TAB = 'REMOVE_TAB';


/* 
* Action Creators
*/
export function DrawerToggle() {
  return {type: TOGGLE_DRAWER};
}

export function TabAddition({name}) {
  return {
    type: ADD_TAB,
    payload: {
      name
    }
  }
}

export function TabChange(index) {
  return {
    type: CHANGE_TAB,
    payload: index
  }
}

export function TabRemoval(index) {
  return {
    type: REMOVE_TAB,
    payload: index
  }
}



