"use client";

import { useState, useRef, useEffect } from "react";

import { currencyFormatter } from "@/lib/utils";

import Modal from "@/components/Modal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Firebase
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { Income } from "@/typings";
import ExpenseItem from "@/components/ExpenseItem";

ChartJS.register(ArcElement, Tooltip, Legend);

const DUMMY_DATA = [
  {
    id: 1,
    title: "Entertainment",
    color: "#000",
    amount: 500,
  },
  {
    id: 2,
    title: "Gass",
    color: "#009",
    amount: 200,
  },
  {
    id: 3,
    title: "Fuel",
    color: "#000",
    amount: 1200,
  },
  {
    id: 4,
    title: "Movies",
    color: "#000",
    amount: 800,
  },
  {
    id: 5,
    title: "Holiday",
    color: "#000",
    amount: 2000,
  },
];

export default function Home() {
  const [income, setIncome] = useState<Income[]>([]);
  

  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);


  // Handler Functions
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

  const deleteIncomeEntryHandler = async (id:string) => {
    const docRef = doc(db, "income", id);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) => {
        return prevState.filter((i) => i.id !== id);
      });
      // Update State
    } catch (error) {
      console.log(error);
    }
  };

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
      <Modal show={showAddIncomeModal} onClose={setShowAddIncomeModal}>
        <form onSubmit={addIncomeHanlder} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="amount">Income Amount</label>
            <input
              type="number"
              name="amount"
              ref={amountRef}
              min={0.01}
              step={0.01}
              placeholder="Enter income amount"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input
              name="description"
              ref={descriptionRef}
              type="text"
              placeholder="Enter income description"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add entry
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-6">
          <h3 className="text-2xl font-bold">Income History</h3>

          {income.map((i) => {
            return (
              <div className="flex justify-between item-center" key={i.id}>
                <div>
                  <p className="font-semibold">{i.description}</p>
                  <small className="text-xs">{i.createdAt.toISOString()}</small>
                </div>
                <p className="flex items-center gap-2">
                  {currencyFormatter(i.amount)}
                  <button
                    onClick={() => {
                      deleteIncomeEntryHandler(i.id);
                    }}
                  >
                    <FaRegTrashAlt />
                  </button>
                </p>
              </div>
            );
          })}
        </div>
      </Modal>

      <main className="container max-w-2xl px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(100000)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button onClick={() => {}} className="btn btn-primary">
            + Expenses
          </button>
          <button
            onClick={() => {
              setShowAddIncomeModal(true);
            }}
            className="btn btn-primary-outline"
          >
            + Income
          </button>
        </section>

        {/* Expenses */}
        <section className="py-6">
          <h3 className="text-2xl">My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {DUMMY_DATA.map((expense) => {
              return (
                <ExpenseItem
                  key={expense.id}
                  color={expense.color}
                  title={expense.title}
                  amount={expense.amount}
                />
              );
            })}
          </div>
        </section>

        {/* Chart Section */}
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: DUMMY_DATA.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: DUMMY_DATA.map((expense) => expense.amount),
                    backgroundColor: DUMMY_DATA.map((expense) => expense.color),
                    borderColor: ["#18181b"],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}