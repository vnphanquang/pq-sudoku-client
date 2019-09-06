/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const ADD_TAB = 'ADD_TAB';


/* 
* Action Creators
*/
export function DrawerToggle() {
  return {type: TOGGLE_DRAWER};
}

export function TabAddition(name) {
  return {
    type: ADD_TAB,
    payload: {
      name
    }
  }
}



