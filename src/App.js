import './App.css';
import { useEffect, useState } from 'react';
import useAxios from './hooks/useAxios';
import Select from 'react-select';

import { isNull } from 'lodash';

const App = () => {
  // pre defined empty arrays
  const arr = [];
  const fullObj = [];

  // react hooks
  const [regionData, setRegionData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [lastObj, setLastObj] = useState([]);
  const [param, setParam] = useState(null);
  const [region, setRegion] = useState();
  const [body, setBody] = useState();
  const [selected, setSelected] = useState();

  // custom hook useAxios which makes requests based on props
  const { error, loading, response } = useAxios({
    method: 'get',
    url: isNull(param) ? 'region' : `city?region=${param}`,
    headers: JSON.stringify({ accept: '*/*' }),
  });

  // used to map the data to and object and fill dropdown lists
  useEffect(() => {
    if (response !== null) {
      response.map((v, i) => {
        const obj = {
          label: v[Object.getOwnPropertyNames(v)[0]],
          value: Object.getOwnPropertyNames(v)[0],
        };
        arr.push(obj);
      });
      if (isNull(param)) {
        setRegionData(arr);
      } else setCityData(arr);
    }
  }, [response]);

  // used to console log the resultt
  useEffect(() => {
    let body = {
      regions: [
        {
          cities: lastObj,
          region: region,
        },
      ],
    };
    setBody(body);
  }, [lastObj]);

  // handle onClick change on both dropdown lists based on parameters
  const handleChange = (value, source) => {
    if (source === 'region') {
      setParam(value.value);
      setRegion(value.label);
      setSelected([]);
    } else {
      setSelected(value);
      value.forEach((element, i) => {
        fullObj.push(element.label);
      });
    }
    setLastObj(fullObj);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {error && (
            <div>
              <p>{error.message}</p>
            </div>
          )}
          <div className="flex-container flex-start">
            <Select
              options={regionData}
              isLoading={loading}
              onChange={(val) => handleChange(val, 'region')}
              styles={{ width: '100%' }}
            />
          </div>
          <div className="flex-container flex-start">
            <Select
              value={selected}
              options={cityData}
              isMulti
              isLoading={loading}
              onChange={(val) => handleChange(val, 'city')}
              isDisabled={isNull(param)}
            />
          </div>
        </div>

        <code>{JSON.stringify(body)}</code>
      </header>
    </div>
  );
};

export default App;
