"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useApp } from "../../context/AppContext"
import SheepCard from "../../components/SheepCard"
import Modal from "../../components/Modal"
import { Plus, Search } from "lucide-react"

const Sheeps = () => {
  const { user } = useAuth()
  const { sheep, fetchSheep, addSheep, updateSheep, deleteSheep, createBuyRequest } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSheep, setSelectedSheep] = useState(null)
  const [formData, setFormData] = useState({
    race: "",
    weight: "",
    age: "",
    origin: "",
    price: "",
    pointOfSale: "",
    image: "",
  })

  // Check if user is admin
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetchSheep()
  }, [])

  const filteredSheep = sheep.filter(
    (sheepItem) =>
      sheepItem.id.toString().includes(searchTerm) ||
      sheepItem.race?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheepItem.origin?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedSheep = [...filteredSheep].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "weight":
        return a.weight - b.weight
      case "age":
        return a.age - b.age
      default:
        return a.id - b.id
    }
  })

  const handleAddSheep = () => {
    setFormData({
      race: "",
      weight: "",
      age: "",
      origin: "",
      price: "",
      pointOfSale: "",
      image: "",
    })
    setShowAddModal(true)
  }

  const handleEditSheep = (sheepItem) => {
    setSelectedSheep(sheepItem)
    setFormData({
      race: sheepItem.race || "",
      weight: sheepItem.weight || "",
      age: sheepItem.age || "",
      origin: sheepItem.origin || "",
      price: sheepItem.price || "",
      pointOfSale: sheepItem.pointOfSale || "",
      image: sheepItem.image || "",
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedSheep) {
        await updateSheep(selectedSheep.id, formData)
        setShowEditModal(false)
      } else {
        await addSheep(formData)
        setShowAddModal(false)
      }
      setSelectedSheep(null)
    } catch (error) {
      console.error("Error saving sheep:", error)
    }
  }

  const handleDeleteSheep = async (id) => {
    if (window.confirm("Are you sure you want to delete this sheep?")) {
      try {
        await deleteSheep(id)
      } catch (error) {
        console.error("Error deleting sheep:", error)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBuySheep = async (sheep) => {
    try {
      // Create buy request notification for admin
      const buyRequestData = {
        userId: user.id || user._id,
        userName: `${user.firstName || user.name} ${user.lastName || ""}`.trim(),
        userEmail: user.email,
        sheepId: sheep.id || sheep._id,
        sheepInfo: {
          race: sheep.race,
          weight: sheep.weight,
          age: sheep.age,
          price: sheep.price,
          origin: sheep.origin,
        },
        requestedAt: new Date().toISOString(),
      }

      await createBuyRequest(buyRequestData)

      alert(`Buy request sent! Admin will review your request for Sheep #${sheep.id || sheep._id}`)
    } catch (error) {
      console.error("Error creating buy request:", error)
      alert("Failed to send buy request. Please try again.")
    }
  }

  return (
    <div className="sheeps-page">
      <div className="page-header">
        <div className="header-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, race, or origin..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="price">Sort by Price</option>
            <option value="weight">Sort by Weight</option>
            <option value="age">Sort by Age</option>
          </select>

          {/* Only show Add button for admins */}
          {isAdmin && (
            <button className="btn-add" onClick={handleAddSheep}>
              <Plus size={20} />
              Add Sheep
            </button>
          )}
        </div>
      </div>

      <div className="sheep-grid">
        {sortedSheep.map((sheepItem) => (
          <SheepCard
            key={sheepItem.id}
            sheep={sheepItem}
            onEdit={isAdmin ? handleEditSheep : null}
            onDelete={isAdmin ? handleDeleteSheep : null}
            onView={(sheep) => console.log("View sheep:", sheep)}
            onBuy={!isAdmin ? handleBuySheep : null}
            showActions={true}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {sortedSheep.length === 0 && (
        <div className="empty-state">
          <p>No sheep found matching your criteria.</p>
        </div>
      )}

      {/* Add Sheep Modal - Admin Only */}
      {isAdmin && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add a Sheep">
          <form onSubmit={handleSubmit} className="sheep-form">
            <div className="form-group">
              <label className="form-label">Race</label>
              <input
                type="text"
                name="race"
                className="form-input"
                value={formData.race}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight</label>
              <input
                type="number"
                name="weight"
                className="form-input"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Origin</label>
              <input
                type="text"
                name="origin"
                className="form-input"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Point of sale</label>
              <select
                name="pointOfSale"
                className="form-input"
                value={formData.pointOfSale}
                onChange={handleChange}
                required
              >
                <option value="">Select point of sale</option>
                <option value="center1">Center 1</option>
                <option value="center2">Center 2</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <input type="file" name="image" className="form-input" accept="image/*" onChange={handleChange} />
            </div>

            <button type="submit" className="btn-submit">
              Add Data
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Sheep Modal - Admin Only */}
      {isAdmin && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit a Sheep">
          <form onSubmit={handleSubmit} className="sheep-form">
            <div className="form-group">
              <label className="form-label">Race</label>
              <input
                type="text"
                name="race"
                className="form-input"
                value={formData.race}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight</label>
              <input
                type="number"
                name="weight"
                className="form-input"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Origin</label>
              <input
                type="text"
                name="origin"
                className="form-input"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Point of sale</label>
              <select
                name="pointOfSale"
                className="form-input"
                value={formData.pointOfSale}
                onChange={handleChange}
                required
              >
                <option value="">Select point of sale</option>
                <option value="center1">Center 1</option>
                <option value="center2">Center 2</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <input type="file" name="image" className="form-input" accept="image/*" onChange={handleChange} />
            </div>

            <button type="submit" className="btn-submit">
              Update Data
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Sheeps
