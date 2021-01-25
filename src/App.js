import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useDebounce from './useDebounce';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [cities, setCities] = useState([]);
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(true);
  const debounce = useDebounce(searchValue, 1000);
  
  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value);
    const tempCitites = isStringIncludes(value, cities)
    setCities(tempCitites)
  }

  const onListClick = (e) => {
    const data = e.target.innerHTML
    setSearchValue(data)
  }

  const handleClick = () => {
    setShowOptions(prev => !prev);
  }

  const inputData = {
    name: 'randomSearch',
    value: searchValue,
    onChange: handleChange,
    onClick: handleClick,
    placeholder: 'From',
  }

  

  useEffect(() => {
    const getRequiredData = async () => {
      try{ 
        const query = searchValue? `&search_query=${searchValue}`: '';
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
    } catch {
      console.error('error');
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
	      <form class="search" action="" >
	      	 <input type="text" {...inputData}

           />
	      	 <ul class="results" >
	      		 {cities.map(item => item.show && <li onClick={onListClick}>{item.label}</li>)}
	      	 </ul>
	      </form>
    </div>
  );
}

export default App;



function responseHandler (response) {
  const { data }  =  response.data || {};
  const list = data.r.map(item => ({label:item.n, show: true}))
  return list;
}

function errorHandler(error) {
  console.error(error);
}

function isStringIncludes(value, arr ) {
  const stringsArr = arr.map(item => {
    return {
    label: item.label, 
    show: value == ''? true: item && item.label.toLowerCase().includes(value.toLowerCase()) 
  }}
  );
  return stringsArr;
}