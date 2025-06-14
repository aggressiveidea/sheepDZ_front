
import { Edit, Trash2, Eye, ShoppingCart } from "lucide-react"

const SheepCard = ({ sheep, onEdit, onDelete, onView, onBuy, showActions = true, isAdmin = false }) => {
  
  const getImageUrl = (sheep) => {
    return sheep.image || sheep.imageUrl || "/images/sheep-placeholder.png"
  }

  return (
    <div className="sheep-card">
      <div className="sheep-image">
        <img
          src={getImageUrl(sheep) || "/placeholder.svg"}
          alt={`Sheep ${sheep.id || sheep._id}`}
          onError={(e) => {
            console.log("Image failed to load:", e.target.src)
            e.target.src = "/images/sheep-placeholder.png"
          }}
          onLoad={(e) => {
            console.log("Image loaded successfully:", e.target.src)
          }}
        />
      </div>

      <div className="sheep-info">
        <h3 className="sheep-title">Sheep #{sheep.id || sheep._id}</h3>
        <div className="sheep-details">
          <p className="sheep-detail">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">
              {sheep.weight}kg • Age: {sheep.age} years
            </span>
          </p>
          <p className="sheep-detail">
            <span className="detail-label">Race:</span>
            <span className="detail-value">{sheep.race}</span>
          </p>
          <p className="sheep-detail">
            <span className="detail-label">Origin:</span>
            <span className="detail-value">{sheep.origin}</span>
          </p>
          <p className="sheep-price">{sheep.price}DH</p>
        </div>

        {showActions && (
          <div className="sheep-actions">
            <button className="btn-view" onClick={() => onView(sheep)}>
              <Eye size={16} />
              View Details
            </button>

            {!isAdmin && onBuy && (
              <button className="btn-buy" onClick={() => onBuy(sheep)}>
                <ShoppingCart size={16} />
                Buy this sheep
              </button>
            )}
          </div>
        )}

        {isAdmin && onEdit && onDelete && (
          <div className="sheep-admin-actions">
            <button className="btn-edit" onClick={() => onEdit(sheep)}>
              <Edit size={16} />
            </button>
            <button className="btn-delete" onClick={() => onDelete(sheep.id || sheep._id)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SheepCard
