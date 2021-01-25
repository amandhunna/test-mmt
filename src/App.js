import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useDebounce from './useDebounce';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounce = useDebounce(searchValue, 1000);
  
  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value);
  }

  const inputData = {
    name: 'randomSearch',
    value: searchValue,
    onChange: handleChange,
    placeholder: 'From',
  }

  
  useEffect(() => {
    const getRequiredData = async () => {
      try{ 
        if(!debounce) {
          setLoading(false);
          return;
        }
        const query = `&search_query=${debounce}`;
        const url = 'https://voyager.goibibo.com/api/v2/flights_search/find_node_by_name_v2/?limit=15' + query +'&v=2'

      const config = {
        method: 'get',
        url,
        headers: { }
      };

      const response = await axios(config);
      const data = responseHandler(response)
      setCities(data)
      setLoading(false);
    } catch(error) {
      errorHandler(error);
      setLoading(false);
    }
    }
    getRequiredData();
  }, [debounce]);


  if(loading) {
    return (<div> Loading...</div>)
  }

  return (
    <div id="container">
	      <form className="search" action="" >
          <label htmlFor="city">Cities</label>
	      	<input list='city' type="text" {...inputData} />
	      	 <datalist id="city">
	      		 {cities.map(item => <option key={item.id } value={item.label}/>)}
            </datalist>
	      </form>
    </div>
  );
}

export default App;



function responseHandler (response) {
  const { data }  =  response.data || {};
  const list = data.r.map(item => ({id: item._id, label:item.n}))
  return list;
}

function errorHandler(error) {
  console.error(error);
}
