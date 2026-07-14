import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Pencil, Eye } from "lucide-react"
import DeleteRestaurantButton from "@/components/admin/DeleteRestauranteButton"

export default async function AdminRestaurantesPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      municipality: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >

        <div>

          <h1
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 4px",
              fontFamily: "var(--font-display)",
            }}
          >
            Restaurantes
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: "13px",
              margin: 0,
            }}
          >
            {restaurants.length} restaurantes registrados
          </p>

        </div>

        <Link
          href="/admin/restaurantes/nuevo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#15803d",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          <Plus size={15} />
          Nuevo restaurante
        </Link>

      </div>

      <div
        style={{
          background: "#141414",
          borderRadius: "16px",
          border: "1px solid #2a2a2a",
          overflow: "hidden",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >

          <thead>

            <tr
              style={{
                borderBottom: "1px solid #2a2a2a",
              }}
            >

              <th style={headerStyle}>Nombre</th>

              <th style={headerStyle}>
                Tipo de comida
              </th>

              <th style={headerStyle}>
                Municipio
              </th>

              <th style={headerStyle}>
                Precio promedio
              </th>

              <th style={headerStyle}>
                Estado
              </th>

              <th style={headerStyle}>
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {restaurants.map((restaurant) => (

              <tr
                key={restaurant.id}
                style={{
                  borderBottom: "1px solid #1f1f1f",
                }}
              >

                <td style={cellStyle}>

                  <div
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {restaurant.name}
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,.3)",
                      fontSize: "11px",
                      marginTop: "2px",
                    }}
                  >
                    {restaurant.slug}
                  </div>

                </td>

                <td
                  style={{
                    ...cellStyle,
                    color: "rgba(255,255,255,.6)",
                  }}
                >
                  {restaurant.foodType}
                </td>

                <td
                  style={{
                    ...cellStyle,
                    color: "rgba(255,255,255,.6)",
                  }}
                >
                  {restaurant.municipality.name}
                </td>

                <td
                  style={{
                    ...cellStyle,
                    color: "#6ee7b7",
                    fontWeight: 600,
                  }}
                >
                  ${restaurant.priceAvg.toLocaleString("es-CO")}
                </td>

                <td style={cellStyle}>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: "20px",

                      background:
                        restaurant.status === "PUBLISHED"
                          ? "#0f2318"
                          : "#2a2410",

                      color:
                        restaurant.status === "PUBLISHED"
                          ? "#6ee7b7"
                          : "#fbbf24",

                      border:
                        restaurant.status === "PUBLISHED"
                          ? "1px solid #1a3d2b"
                          : "1px solid #4a3d1a",
                    }}
                  >
                    {restaurant.status === "PUBLISHED"
                      ? "Publicado"
                      : "Borrador"}
                  </span>

                </td>

                <td style={cellStyle}>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >

                    <Link
                      href={`/restaurantes/${restaurant.slug}`}
                      target="_blank"
                      style={iconButtonStyle}
                    >
                      <Eye size={14} />
                    </Link>

                    <Link
                      href={`/admin/restaurantes/${restaurant.id}/editar`}
                      style={iconButtonStyle}
                    >
                      <Pencil size={14} />
                    </Link>

                    <DeleteRestaurantButton
                      restaurantId={restaurant.id}
                    />

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

const headerStyle = {
  textAlign: "left" as const,
  padding: "14px 20px",
  color: "rgba(255,255,255,.4)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
}

const cellStyle = {
  padding: "16px 20px",
  fontSize: "13px",
}

const iconButtonStyle = {
  padding: "8px",
  borderRadius: "8px",
  color: "rgba(255,255,255,.4)",
  display: "flex",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
}