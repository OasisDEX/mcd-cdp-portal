import { useContext } from 'react';
import { SidebarStateContext } from 'providers/SidebarProvider';

function useSidebar() {
  const context = useContext(SidebarStateContext);
  const { show, reset, current } = context;
  return { show, reset, current };
}

export default useSidebar;
