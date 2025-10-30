// CSV Parser utility for bulk flyer imports
export interface CSVFlyerData {
  title: string
  price: "$10" | "$15" | "$40"
  formType: "With Photo" | "Only Info" | "Birthday"
  categories: string[]
  recentlyAdded: boolean
}

export function parseCSV(csvContent: string): CSVFlyerData[] {
  const lines = csvContent.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  const titleIndex = headers.indexOf("title")
  const priceIndex = headers.indexOf("price")
  const formTypeIndex = headers.indexOf("formtype")
  const categoriesIndex = headers.indexOf("categories")
  const recentlyAddedIndex = headers.indexOf("recentlyadded")

  const flyers: CSVFlyerData[] = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = lines[i].split(",").map((v) => v.trim())

    const title = titleIndex >= 0 ? values[titleIndex] : `Flyer ${i}`
    const price = (priceIndex >= 0 ? values[priceIndex] : "$10") as "$10" | "$15" | "$40"
    const formType = (formTypeIndex >= 0 ? values[formTypeIndex] : "Only Info") as
      | "With Photo"
      | "Only Info"
      | "Birthday"
    const categoriesStr = categoriesIndex >= 0 ? values[categoriesIndex] : ""
    const categories = categoriesStr ? categoriesStr.split(";").map((c) => c.trim()) : []
    const recentlyAdded = recentlyAddedIndex >= 0 ? values[recentlyAddedIndex].toLowerCase() === "true" : true

    flyers.push({
      title,
      price,
      formType,
      categories,
      recentlyAdded,
    })
  }

  return flyers
}

export function generateCSVTemplate(): string {
  return `title,price,formtype,categories,recentlyadded
Birthday Celebration,$10,With Photo,Birthday;Party,true
Wedding Invitation,$15,Only Info,Wedding;Event,true
Corporate Event,$40,Birthday,Corporate;Event,false`
}
