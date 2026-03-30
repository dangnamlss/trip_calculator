import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCgvIbstsX35v_GXXTCAGBbwkj8xm0Xs5k',
  authDomain: 'app-du-lich-e11b6.firebaseapp.com',
  projectId: 'app-du-lich-e11b6',
  storageBucket: 'app-du-lich-e11b6.firebasestorage.app',
  messagingSenderId: '404808342317',
  appId: '1:404808342317:web:addcf48201570014e391a4',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const expensesCollection = collection(db, 'expenses')

const defaultPeople = [
  'Namdepzai',
  'Hiếu au',
  'Hiếu C',
  'Trang',
  'Tuấn Đ',
  'Hương',
  'Tuấn béo',
  'Đông béo',
  'E Huyền 2k6',
  'Đức Anh',
  'Ny Đức Anh',
  'Phong bé'
]

export default function ExpenseSplitter() {
  const [expenses, setExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [summary, setSummary] = useState({})
  const [editing, setEditing] = useState({})

  useEffect(() => {
    const q = query(expensesCollection, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setExpenses(docs)
    })
    return () => unsub()
  }, [])

  const addExpense = () => {
    const tempId = 'temp-' + Date.now()
    const newExpense = {
      id: tempId,
      title: '',
      amount: '',
      expanded: true,
      isNew: true,
      participants: defaultPeople.map((name) => ({ name, included: false })),
    }
    setExpenses((prev) => [newExpense, ...prev])
    setEditing((prev) => ({ ...prev, [tempId]: true }))
  }

  const saveNewExpense = async (tempId) => {
    const expense = expenses.find((e) => e.id === tempId)
    const newDoc = {
      title: expense.title,
      amount: expense.amount,
      expanded: false,
      createdAt: new Date(),
      participants: expense.participants,
    }
    const docRef = await addDoc(expensesCollection, newDoc)
    setExpenses((prev) => prev.filter((e) => e.id !== tempId))
  }

  const updateExpense = async (id, data) => {
    data.expanded = false
    const expense = expenses.find((e) => e.id === id)
    const updated = { ...expense, ...data }
    await setDoc(doc(db, 'expenses', id), updated)
    setEditing((prev) => ({ ...prev, [id]: false }))
  }

  const deleteExpense = async (id) => {
    const exp = expenses.find((e) => e.id === id)
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa khoản chi "${exp.title || 'không tên'}"?`
    )
    if (confirmDelete) {
      if (id.startsWith('temp-')) {
        setExpenses((prev) => prev.filter((e) => e.id !== id))
      } else {
        await deleteDoc(doc(db, 'expenses', id))
      }
    }
  }

  const toggleParticipant = (expenseId, name) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp
        return {
          ...exp,
          participants: exp.participants.map((p) =>
            p.name === name ? { ...p, included: !p.included } : p
          ),
        }
      })
    )
  }

  const checkAllParticipants = (expenseId) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp
        return {
          ...exp,
          participants: exp.participants.map((p) => ({ ...p, included: true })),
        }
      })
    )
  }

  const formatCurrency = (value) => {
    const numeric = value.replace(/\D/g, '')
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const parseCurrency = (formatted) => formatted.replace(/\./g, '')

  const calculateSummary = () => {
    const totals = {}
    defaultPeople.forEach((name) => (totals[name] = 0))
    expenses.forEach((exp) => {
      if (!exp.amount) return
      const rawAmount = parseFloat(parseCurrency(exp.amount || '0'))
      const included = exp.participants.filter((p) => p.included)
      const split = included.length > 0 ? rawAmount / included.length : 0
      included.forEach((p) => {
        totals[p.name] += split
      })
    })
    setSummary(totals)
    setShowModal(true)
  }

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const rows = Object.entries(summary).map(([name, amount]) => ({
      Người: name,
      'Tổng chi trả (đ)': parseInt(amount.toFixed(0), 10),
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, 'Tổng hợp')
    XLSX.writeFile(wb, 'tong_hop_chi_tieu.xlsx')
  }

  const totalAmount = Object.values(summary).reduce((sum, val) => sum + val, 0)

  return (
    <div className="container mt-4">
      <div className="d-flex gap-2 mb-3">
        <button onClick={addExpense} className="btn btn-primary w-100">
          Tạo khoản chi tiêu mới
        </button>
        <button onClick={calculateSummary} className="btn btn-success w-100">
          Tổng hợp
        </button>
      </div>

      {expenses.map((exp) => {
        const rawAmount = parseFloat(parseCurrency(exp.amount || '0'))
        const included = exp.participants.filter((p) => p.included)
        const split = included.length > 0 ? rawAmount / included.length : 0
        const isEditing = editing[exp.id]

        return (
          <div key={exp.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Tên khoản chi"
                    value={exp.title}
                    onChange={(e) =>
                      setExpenses((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, title: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                ) : (
                  <h5 className="me-2 mb-0">
                    {exp.title || <em>(Không tên)</em>}
                  </h5>
                )}
                <div className="d-flex gap-1">
                  {isEditing ? (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => {
                        if (exp.id.startsWith('temp-')) saveNewExpense(exp.id)
                        else updateExpense(exp.id, exp)
                      }}
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => {
                        setEditing((prev) => ({ ...prev, [exp.id]: true }))
                        exp.expanded = true
                      }}
                    >
                      Sửa
                    </button>
                  )}

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      deleteExpense(exp.id)
                    }}
                  >
                    Xóa
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setExpenses((prev) =>
                        prev.map((e) =>
                          e.id === exp.id ? { ...e, expanded: !e.expanded } : e
                        )
                      )
                    }
                  >
                    {exp.expanded ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>
              {exp.expanded && (
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control mb-3"
                      placeholder="Tổng số tiền"
                      value={exp.amount}
                      onChange={(e) =>
                        setExpenses((prev) =>
                          prev.map((item) =>
                            item.id === exp.id
                              ? {
                                  ...item,
                                  amount: formatCurrency(e.target.value),
                                }
                              : item
                          )
                        )
                      }
                    />
                  ) : (
                    <p className="mb-3">
                      <strong>Tổng tiền:</strong>{' '}
                      {formatCurrency(exp.amount || '0')} đ
                    </p>
                  )}

                  <button
                    className="btn btn-sm btn-outline-primary mb-2"
                    onClick={() => checkAllParticipants(exp.id)}
                  >
                    Chọn tất cả
                  </button>

                  <div className="list-group">
                    {exp.participants.map((p) => (
                      <label
                        key={p.name}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            checked={p.included}
                            onChange={() => toggleParticipant(exp.id, p.name)}
                          />
                          <span className="form-check-label">{p.name}</span>
                        </div>
                        <span className="text-muted">
                          {p.included
                            ? `${formatCurrency(split.toFixed(0))} đ`
                            : '-'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tổng hợp chi tiêu</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {Object.entries(summary).map(([name, amount]) => (
                    <li
                      key={name}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <span>{name}</span>
                      <strong>{formatCurrency(amount.toFixed(0))} đ</strong>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between bg-light">
                    <strong>Tổng tiền</strong>
                    <strong>{formatCurrency(totalAmount.toFixed(0))} đ</strong>
                  </li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={exportToExcel}>
                  Xuất Excel
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
