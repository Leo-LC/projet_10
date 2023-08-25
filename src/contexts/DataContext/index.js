import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  const getData = useCallback(async () => {
    try {
      const newData = await api.loadData();
      setData(newData);
      setLastEvent(newData.events[0]);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        lastEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
