import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cardItems, setCardItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };
  
  //  Fetch User Auth Status, User Data and Card Items
  const fetchUser = async ()=>{
   try {
     const{data}=await axios.get('/api/user/is-auth');
     if(data.success){
      setUser(data.user)
      setCardItems(data.user.cardItems)
     }
   } catch (error) {
    setUser(null)
   }
  }

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add Product To Card
  const addToCard = (itemId) => {
    let cardData = structuredClone(cardItems);

    if (cardData[itemId]) {
      cardData[itemId] += 1;
    } else {
      cardData[itemId] = 1;
    }
    setCardItems(cardData);
    toast.success("Added to Card");
  };

  // Update Card Item Quantity
  const updateCardItem = (itemId, quality) => {
    let cardData = structuredClone(cardItems);
    cardData[itemId] = quality;
    setCardItems(cardData);
    toast.success("Card Updated");
  };

  // Remove Product from Card
  const removeFromCard = (itemId) => {
    let cardData = structuredClone(cardItems);
    if (cardData[itemId]) {
      cardData[itemId] -= 1;
      if (cardData[itemId] === 0) {
        delete cardData[itemId];
      }
    }
    toast.success("Removed from Card");
    setCardItems(cardData);
  };

  // Get Card Item Count
  const getCardCount = () => {
    let totalCount = 0;
    for (const item in cardItems) {
      totalCount += cardItems[item];
    }
    return totalCount;
  };

  // Get Card Total Amount
  const getCardAmount = () => {
    let totalAmount = 0;
    for (const items in cardItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cardItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cardItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProducts();
    fetchSeller();
    fetchUser();
  }, []);

  // Update Database Card Items
  useEffect(()=>{
    const updateCard = async ()=>{
      try {
        const {data} = await axios.post('/api/card/update', {cardItems})
        if(!data.success){
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    if(user){
      updateCard()
    }
  },[cardItems])

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCard,
    updateCardItem,
    removeFromCard,
    cardItems,
    searchQuery,
    setSearchQuery,
    getCardAmount,
    getCardCount,
    axios,
    fetchProducts, 
    setCardItems
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
