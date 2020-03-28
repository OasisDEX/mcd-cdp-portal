import { watch } from 'hooks/useObservable';

const initialState = {
  emergencyShutdownActive: undefined,
  emergencyShutdownTime: new Date(0)
};

function useEmergencyShutdown() {
  const emergencyShutdownActive = watch.emergencyShutdownActive();
  const emergencyShutdownTime = watch.emergencyShutdownTime();

  return emergencyShutdownActive === undefined
    ? initialState
    : {
        emergencyShutdownActive,
        emergencyShutdownTime
      };
}

export default useEmergencyShutdown;
