"use client"
import { useAuthStore } from "../context/AuthContext";
import CustomerHomeScreen from "./customer/CustomerHomeScreen";
import FreelancerHomeScreen from "./freelancer/FreelancerHomeScreen";

export default function HomeScreen() {
  const { user } = useAuthStore();

  if (user?.role === "customer") {
    return <CustomerHomeScreen />;
  }

  return <FreelancerHomeScreen />;
}
