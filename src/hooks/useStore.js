import { useContext } from 'react';
import { StoreContext } from 'providers/StoreProvider';

const useStore = () => useContext(StoreContext);
export default useStore;
