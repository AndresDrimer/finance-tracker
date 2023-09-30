"use client";

import ExpenseItem from "@/components/ExpenseItem";
import Modal from "@/components/Modal";
import { currencyFormatter } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

//Firebase imports
import { db } from "@/lib/firebase/index";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

//Import Types
import { Income } from "@/typings";

//Import React-Icons
import {FaRegTrashAlt} from "react-icons/fa"

const DUMMY_DATA = [
  {
    id: 1,
    title: "Cine",
    color: "#000",
    amount: 500,
  },
  {
    id: 2,
    title: "Compras",
    color: "#009",
    amount: 150,
  },
  {
    id: 3,
    title: "Verduleria",
    color: "#045",
    amount: 4500,
  },
  {
    id: 4,
    title: "Estacionamiento",
    color: "#999",
    amount: 2500,
  },
];

const data = {
  labels: DUMMY_DATA.map((it) => it.title),
  datasets: [
    {
      label: "Expenses",
      data: DUMMY_DATA.map((it) => it.amount),
      backgroundColor: DUMMY_DATA.map((it) => it.color),
      borderColor: ["#18181b"],
      borderWidth: 5,
    },
  ],
};

export default function Home() {
  const [income, setIncome] = useState<Income[]>([]);
  console.log(income);

  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);

  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  //handler Functions

  const addIncomeHanlder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (amountRef.current && descriptionRef.current) {
      const newIncome = {
        amount: Number(amountRef.current.value),
        createdAt: new Date(),
        description: descriptionRef.current.value,
      };
      

      const collectionRef = collection(db, "income");

      try {
        const docSnap = await addDoc(collectionRef, newIncome);
                
        
        //update State
        setIncome((prev) => {
          return [
            ...prev,
            {
              id: docSnap.id,
              ...newIncome,
            },
          ];
        });

        descriptionRef.current.value = "";
        amountRef.current.value= "";

      } catch (error) {
        console.error("Error adding document: ", error);
      }
      
    } else {
      console.error("Form fields are not defined");
    }
  };

  const deleteIncomeEntryHandler = async (id: string) =>{
    try {
       const docRef =  doc(db, "income", id)
 await deleteDoc(docRef);

 //update state for UI
 setIncome(prev => prev.filter(it => it.id !== id));

    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      const docsSnap = await getDocs(collectionRef);

      const data = docsSnap.docs.map((it) => {
        return {
          id: it.id,
          amount: it.data().amount,
          description: it.data().description,
          createdAt: it.data().createdAt
            ? new Date(it.data().createdAt.toMillis())
            : new Date(),
        };
      });

      setIncome(data);
    };

    getIncomeData();
  }, []);
  return (
    <>
      {/* Add Income Modal */}
     

      <main className="container max-w-2xl px-6 mx-auto">
        <section className="py-3">
          <p className="text-gray-400 text-md">My Balance</p>

          <h2 className="text-4xl font-bold">{currencyFormatter(100000)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button className="btn btn-primary">+ Expense</button>
          <button
            onClick={() => setShowAddIncomeModal(true)}
            className="btn btn-primary-outline"
          >
            + Income
          </button>
        </section>

        {/* Expenses */}
        <section className="py-6">
          <h3 className="text-2xl">My expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {/* Expense item */}
            {DUMMY_DATA.map((it) => (
              <ExpenseItem
                amount={it.amount}
                color={it.color}
                title={it.title}
                key={it.id}
              />
            ))}
          </div>
        </section>

        {/* Chart section */}
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut data={data} />
          </div>
        </section>
      </main>
    </>
  );
}
