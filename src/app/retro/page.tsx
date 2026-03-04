import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/database";
import "./retro.css";

const fallbackProducts = [
  { id: "1", name: "Pop-It Fidget Board", slug: "pop-it-fidget-board", price: 299, compare_at_price: 499, thumbnail_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop", is_featured: true },
  { id: "2", name: "Montessori Stacking Tower", slug: "montessori-stacking-tower", price: 1299, compare_at_price: 1799, thumbnail_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=400&fit=crop", is_featured: true },
  { id: "3", name: "Magnetic Building Tiles", slug: "magnetic-building-tiles-120", price: 2199, compare_at_price: 2999, thumbnail_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", is_featured: true },
  { id: "4", name: "Robotics Starter Kit", slug: "robotics-starter-kit-pro", price: 4999, compare_at_price: 6999, thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop", is_featured: true },
  { id: "5", name: "Smart Kitchen Organizer", slug: "smart-kitchen-organizer", price: 1599, compare_at_price: 2199, thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", is_featured: false },
  { id: "6", name: "BT Speaker Pro", slug: "bluetooth-speaker-pro", price: 3499, compare_at_price: 4999, thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", is_featured: false },
  { id: "7", name: "Premium Notebook Set", slug: "premium-notebook-set", price: 899, compare_at_price: 1299, thumbnail_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop", is_featured: false },
  { id: "8", name: "Yoga Mat Premium", slug: "yoga-mat-premium", price: 1299, compare_at_price: 1899, thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", is_featured: false },
];

async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8) as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackProducts;
    return data;
  } catch {
    return fallbackProducts;
  }
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getDiscount(price: number, compareAt: number | null | undefined) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export default async function RetroPage() {
  const products = await getProducts();
  const featured = products.filter((p: any) => p.is_featured);
  const allProds = products;

  // Fake visitor counter (seeded from date)
  const day = new Date().getDate();
  const visitorCount = 13847 + day * 37;

  return (
    <div className="retro-page">
      {/* Resolution Warning */}
      <div className="resolution-warning">
        ⚠ BEST VIEWED AT 800x600 RESOLUTION IN NETSCAPE NAVIGATOR 4.0 OR INTERNET EXPLORER 5.5 ⚠
      </div>

      {/* ★ MARQUEE HERO ★ */}
      <div className="retro-hero">
        <div className="css-marquee">
          <div className="css-marquee-inner">
            <h1>
              <span className="sparkle">★</span> UP TO 50% OFF <span className="sparkle">★</span> MEGA SALE <span className="sparkle">★</span> UP TO 50% OFF <span className="sparkle">★</span> LIMITED TIME ONLY <span className="sparkle">★</span>
            </h1>
          </div>
        </div>
        <p className="subtitle">
          <span className="blink">🎁</span> Welcome to <b>AIEL ENTERPRISES</b> — Your #1 Gift Shop Since 2024! <span className="blink">🎁</span>
        </p>
        <br />
        <Link href="/products" className="retro-btn" style={{ fontSize: 16 }}>
          🛒 SHOP NOW!! 🛒
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link href="/categories" className="retro-btn retro-btn-success">
          📂 BROWSE CATEGORIES
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="retro-nav">
        <Link href="/">🏠 HOME</Link>
        <span className="separator">|</span>
        <Link href="/products">🛍️ ALL PRODUCTS</Link>
        <span className="separator">|</span>
        <Link href="/categories">📁 CATEGORIES</Link>
        <span className="separator">|</span>
        <Link href="/cart">🛒 CART</Link>
        <span className="separator">|</span>
        <Link href="/contact">📧 CONTACT US</Link>
        <span className="separator">|</span>
        <Link href="/track-orders">📦 TRACK ORDER</Link>
        <span className="separator">|</span>
        <Link href="/">🔙 MODERN SITE</Link>
      </nav>

      {/* Feature Strip */}
      <div className="retro-features">
        <span className="spin-icon">🚀</span> FREE SHIPPING OVER ₹999 &nbsp;|&nbsp; 🛡️ QUALITY ASSURED &nbsp;|&nbsp; ⚡ EASY RETURNS &nbsp;|&nbsp; 📞 24/7 SUPPORT <span className="spin-icon">🚀</span>
      </div>

      <hr className="retro-hr" />

      {/* ★ FEATURED PRODUCTS ★ */}
      <div className="retro-section-header">
        <h2><span className="sparkle">✦</span> <i>FEATURED PRODUCTS</i> — <span className="blink">HOT DEALS!!</span> <span className="sparkle">✦</span></h2>
      </div>

      <table className="retro-product-table" cellPadding={15} cellSpacing={0} style={{ margin: "0 10px", width: "calc(100% - 20px)" }}>
        <tbody>
          <tr>
            {featured.slice(0, 4).map((product: any) => {
              const discount = getDiscount(product.price, product.compare_at_price);
              return (
                <td key={product.id}>
                  {discount > 0 && (
                    <div style={{ textAlign: "center", marginBottom: 5 }}>
                      <span className="sale-badge">★ {discount}% OFF ★</span>
                    </div>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.thumbnail_url || "https://via.placeholder.com/300x300?text=NO+IMAGE"}
                      alt={product.name}
                      className="product-img"
                    />
                  </Link>
                  <div className="product-name">{product.name}</div>
                  <div className="retro-stars">★★★★☆</div>
                  <div className="product-price">
                    {formatPrice(product.price)}
                    {product.compare_at_price && (
                      <>
                        <br />
                        <span className="original-price">{formatPrice(product.compare_at_price)}</span>
                      </>
                    )}
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <Link href={`/products/${product.slug}`} className="retro-btn" style={{ fontSize: 12, padding: "8px 16px" }}>
                      🔍 QUICK VIEW
                    </Link>
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      <hr className="retro-hr" />

      {/* ★ NEW ARRIVALS ★ */}
      <div className="retro-section-header">
        <h2><span className="rainbow">★★★</span> <i>NEW ARRIVALS</i> <span className="rainbow">★★★</span></h2>
      </div>

      {/* Layout: sidebar + products using table */}
      <table style={{ width: "calc(100% - 20px)", margin: "5px 10px", borderSpacing: 8, borderCollapse: "separate" }}>
        <tbody>
          <tr>
            {/* Sidebar */}
            <td style={{ width: "200px", verticalAlign: "top" }}>
              <div className="retro-sidebar">
                <h3>✦ Categories ✦</h3>
                <ul>
                  <li><Link href="/products?category=sensory-toys">Sensory Toys</Link></li>
                  <li><Link href="/products?category=montessori-toys">Montessori Toys</Link></li>
                  <li><Link href="/products?category=educational-toys">Educational Toys</Link></li>
                  <li><Link href="/products?category=stem-toys">STEM Toys</Link></li>
                  <li><Link href="/products?category=home-kitchen">Home & Kitchen</Link></li>
                  <li><Link href="/products?category=electronics">Electronics</Link></li>
                  <li><Link href="/products?category=stationery-items">Stationery</Link></li>
                  <li><Link href="/products?category=gift-items">Gift Items</Link></li>
                  <li><Link href="/products?category=sport-exercise">Sport & Exercise</Link></li>
                  <li><Link href="/products?category=home-decor">Home Decor</Link></li>
                  <li><Link href="/products?category=gardening">Gardening</Link></li>
                </ul>
                <br />
                <div style={{ textAlign: "center" }}>
                  <Link href="/products" className="retro-btn" style={{ fontSize: 11, padding: "6px 12px" }}>
                    VIEW ALL →
                  </Link>
                </div>
              </div>

              <br />

              <div className="retro-sidebar">
                <h3>📢 Announcements</h3>
                <p style={{ fontSize: 12, lineHeight: 1.5 }}>
                  <span className="blink">🔥 NEW!</span> Spring Sale starts NOW!<br />
                  Free gift wrapping on orders over ₹1500!<br />
                  <b>20% OFF</b> your first order!
                </p>
              </div>
            </td>

            {/* Products Grid */}
            <td style={{ verticalAlign: "top" }}>
              <table className="retro-product-table" cellPadding={15} cellSpacing={0}>
                <tbody>
                  <tr>
                    {allProds.slice(0, 4).map((product: any) => {
                      const discount = getDiscount(product.price, product.compare_at_price);
                      return (
                        <td key={product.id}>
                          {discount > 0 && (
                            <div style={{ textAlign: "center", marginBottom: 5 }}>
                              <span className="sale-badge">★ SALE ★</span>
                            </div>
                          )}
                          <Link href={`/products/${product.slug}`}>
                            <img
                              src={product.thumbnail_url || "https://via.placeholder.com/300x300?text=NO+IMAGE"}
                              alt={product.name}
                              className="product-img"
                            />
                          </Link>
                          <div className="product-name">{product.name}</div>
                          <div className="retro-stars">★★★★☆</div>
                          <div className="product-price">
                            {formatPrice(product.price)}
                            {product.compare_at_price && (
                              <>
                                <br />
                                <span className="original-price">{formatPrice(product.compare_at_price)}</span>
                              </>
                            )}
                          </div>
                          <div style={{ textAlign: "center", marginTop: 8 }}>
                            <Link href={`/products/${product.slug}`} className="retro-btn retro-btn-success" style={{ fontSize: 11, padding: "6px 14px" }}>
                              🛒 ADD TO CART
                            </Link>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {allProds.length > 4 && (
                    <tr>
                      {allProds.slice(4, 8).map((product: any) => {
                        const discount = getDiscount(product.price, product.compare_at_price);
                        return (
                          <td key={product.id}>
                            {discount > 0 && (
                              <div style={{ textAlign: "center", marginBottom: 5 }}>
                                <span className="sale-badge">★ SALE ★</span>
                              </div>
                            )}
                            <Link href={`/products/${product.slug}`}>
                              <img
                                src={product.thumbnail_url || "https://via.placeholder.com/300x300?text=NO+IMAGE"}
                                alt={product.name}
                                className="product-img"
                              />
                            </Link>
                            <div className="product-name">{product.name}</div>
                            <div className="retro-stars">★★★★☆</div>
                            <div className="product-price">
                              {formatPrice(product.price)}
                              {product.compare_at_price && (
                                <>
                                  <br />
                                  <span className="original-price">{formatPrice(product.compare_at_price)}</span>
                                </>
                              )}
                            </div>
                            <div style={{ textAlign: "center", marginTop: 8 }}>
                              <Link href={`/products/${product.slug}`} className="retro-btn retro-btn-success" style={{ fontSize: 11, padding: "6px 14px" }}>
                                🛒 ADD TO CART
                              </Link>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <hr className="retro-hr" />

      {/* Category Badges */}
      <div className="retro-section-header">
        <h2><span className="sparkle">✦</span> SHOP BY CATEGORY <span className="sparkle">✦</span></h2>
      </div>
      <div style={{ textAlign: "center", padding: "10px", margin: "0 10px" }}>
        {["Sensory Toys", "Montessori", "STEM Toys", "Electronics", "Home & Kitchen", "Gift Items", "Stationery", "Sport & Exercise", "Gardening", "Home Decor", "Wooden Toys", "Board Games"].map((cat) => (
          <Link key={cat} href={`/products?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="category-badge">
            {cat}
          </Link>
        ))}
      </div>

      <hr className="retro-hr" />

      {/* ★ NEWSLETTER ★ */}
      <div className="retro-section-header">
        <h2><span className="blink">📧</span> JOIN OUR MAILING LIST <span className="blink">📧</span></h2>
      </div>
      <div style={{ textAlign: "center", padding: "15px", margin: "0 10px", background: "rgba(143, 24, 157, 0.15)", border: "3px ridge var(--clr-primary-a10)" }}>
        <p style={{ fontSize: 14, marginBottom: 10, color: "#ffff00", textShadow: "1px 1px #000", fontWeight: "bold" }}>
          GET 20% OFF YOUR FIRST ORDER!! SIGN UP NOW!!!
        </p>
        <table style={{ margin: "0 auto" }}>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Enter your email..."
                  style={{
                    padding: "8px 12px",
                    border: "3px inset var(--clr-neutral-a20)",
                    fontFamily: "'Comic Sans MS', cursive",
                    fontSize: 14,
                    width: 280,
                    background: "#fff",
                    color: "#000",
                  }}
                  readOnly
                />
              </td>
              <td>&nbsp;</td>
              <td>
                <button className="retro-btn retro-btn-danger" style={{ fontSize: 13 }}>
                  SUBSCRIBE!! 📬
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="retro-hr" />

      {/* Webring */}
      <div className="webring">
        <b>★ AIEL ENTERPRISES WEBRING ★</b><br />
        <Link href="/">← Previous</Link>
        <span style={{ color: "var(--clr-neutral-a20)" }}>|</span>
        <Link href="/">🌐 Random</Link>
        <span style={{ color: "var(--clr-neutral-a20)" }}>|</span>
        <Link href="/">Next →</Link>
      </div>

      {/* ★ FOOTER ★ */}
      <footer className="retro-footer">
        <p className="under-construction">
          🚧 THIS PAGE IS UNDER CONSTRUCTION 🚧
        </p>
        <p>
          <span style={{ fontSize: 24 }}>🔨👷‍♂️🏗️</span>
        </p>
        <br />
        <div className="visitor-counter">
          VISITORS: {visitorCount.toLocaleString()}
        </div>
        <br />
        <p>
          © 2024-{new Date().getFullYear()} <b>AIEL ENTERPRISES</b> — All Rights Reserved.<br />
          Made with ❤️ and <span className="rainbow">Comic Sans MS</span><br />
          <Link href="/">🔙 Back to Modern Site</Link> | <Link href="/contact">📧 Email Webmaster</Link>
        </p>
        <br />
        <p style={{ fontSize: 10, color: "var(--clr-neutral-a30)" }}>
          This site is best viewed with Netscape Navigator 4.0 or Microsoft Internet Explorer 5.5 at 800x600 resolution.
          <br />No frames were harmed in the making of this website. 💾
        </p>
      </footer>
    </div>
  );
}
