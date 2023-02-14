import { Text, Input, Button, Box, useToast, } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import moment from 'moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function App() {
  const toast = useToast();
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [dateRequired, setDateRequired] = useState(false)
  const [visitorsCountRequired, setVisitorsCountRequired] = useState(false)
  const date = useRef(null)
  const visitors = useRef(null)

  const getObject = () => {
    const objectJSONData=localStorage.getItem("object")
    const objectData=JSON.parse(objectJSONData)
    const object=objectData ? objectData :  {};

    return object
  }

  const updateLocalChartData = () => {
    const object = getObject();
    setKeys(Object.keys(object));
    setValues(Object.values(object))
  }

  useEffect(() => {
    updateLocalChartData()
  }, [])

  const onDrawChart = () => {
    updateLocalChartData()
  }

  const addVisitorsCountToLocalStorage = () =>{
    const day=moment(date.current.value).format('DD/MM/YYYY')
    const visitorsCount = visitors.current.value

    const object = getObject();
    const newObject={
      ...object,
      [day.toString()]:+visitorsCount
    }
    const objJSONnData=JSON.stringify(newObject)
    localStorage.setItem('object', objJSONnData)
  }
  
  const checkDate  = () => {
    const object = getObject();
    const day=moment(date.current.value).format('DD/MM/YYYY')
    const dateExists = object[day]

    return dateExists === undefined ? false : true
  }

  const handleClick = () => {

    const dateExists=checkDate()

    if(!date.current.value ){
      setDateRequired(true)
      setVisitorsCountRequired(true)
    }else if(!visitors.current.value){
      setVisitorsCountRequired(true)
    }else if(dateExists){
      toast({
        title: "Date exists",
        status: 'error',
        duration: 3000,
    })

    }
    else{
      addVisitorsCountToLocalStorage()
    }
  }
   const handleChange1 = () => {
      if(!date.current.value){
        setDateRequired(true)
      }else {
      setDateRequired(false)
    }
   }

   const handleChange2 = () => {
    if(!visitors.current.value){
      setVisitorsCountRequired(true)
    }else {
    setVisitorsCountRequired(false)
    }
  }
  return (
    <ChakraProvider>
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    >
      <Text as={"h1"}>
        Add visitors per day
      </Text>
      <Input
      ref={date}
      width="250px"
      height="30px"
      type="date"
      onChange={handleChange1}
      />
      <Box>
      {
        dateRequired ? <Text
        color="red"
        fontSize="12px"
        mb="20px"
        >
          Data is required
        </Text> : <Box></Box>
      }
      </Box>
      <Input
      ref={visitors}
       width="250px"
       height="30px"
      type="number"
      mt="20px"
      onChange={handleChange2}
      />
      <Box>
      {
        visitorsCountRequired ? <Text
        color="red"
        fontSize="12px"
        >
          Visitors count is required
        </Text> : <Text></Text>
      }
      </Box>
      <Button
      onClick={handleClick}
      margin="10px"
      width="70px"
      height="30px"
      border="none"
      color="white"
      bgColor="black"
      >
        Submit
      </Button>
      <Button
       onClick={onDrawChart}
       margin="10px"
       width={"max-content"}
       height="30px"
       border="none"
       color="white"
       bgColor="black"
      >
        Generate report based on submitted data
      </Button>
    </Box>

      <div>
        {
          true &&
          <Bar
        data={{
          labels: keys,
          datasets: [
            {
              label: "total count/value",
              data: values,
              backgroundColor: ["aqua", "green", "red", "yellow"],
              borderColor: ["aqua", "green", "red", "yellow"],
              borderWidth: 0.5,
            },
          ],
        }}
        height={"400px"}
          options={{
            maintainAspectRatio: false,
            legend: {
              labels: {
                fontSize: 15,
              },
            },
          }}
          /> 
        }
           
      </div>
      </ChakraProvider>
  );
}

export default App;
