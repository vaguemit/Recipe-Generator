"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Plus, Trash2, Printer, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState([])
  const [newItem, setNewItem] = useState("")
  const [checkedItems, setCheckedItems] = useState({})
  const { toast } = useToast()

  // Load shopping list from localStorage on component mount
  useEffect(() => {
    const savedShoppingList = localStorage.getItem("shoppingList")
    if (savedShoppingList) {
      try {
        const parsedList = JSON.parse(savedShoppingList)
        // Convert to our format if it's just an array of strings
        if (Array.isArray(parsedList)) {
          if (typeof parsedList[0] === "string") {
            setShoppingList(parsedList.map((item) => ({ name: item, category: categorizeItem(item) })))
          } else {
            setShoppingList(parsedList)
          }
        }
      } catch (e) {
        console.error("Error parsing shopping list:", e)
      }
    }

    const savedCheckedItems = localStorage.getItem("checkedItems")
    if (savedCheckedItems) {
      try {
        setCheckedItems(JSON.parse(savedCheckedItems))
      } catch (e) {
        console.error("Error parsing checked items:", e)
      }
    }
  }, [])

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems))
  }, [checkedItems])

  function categorizeItem(item) {
    // Simple categorization based on keywords
    const lowerItem = item.toLowerCase()

    if (/milk|cheese|yogurt|cream|butter/.test(lowerItem)) return "Dairy"
    if (/beef|chicken|pork|fish|salmon|tuna|meat|steak/.test(lowerItem)) return "Meat & Seafood"
    if (/apple|banana|orange|grape|berry|fruit/.test(lowerItem)) return "Fruits"
    if (/carrot|onion|potato|tomato|lettuce|spinach|vegetable|pepper|garlic/.test(lowerItem)) return "Vegetables"
    if (/bread|bagel|roll|bun/.test(lowerItem)) return "Bakery"
    if (/pasta|rice|cereal|flour|sugar|salt/.test(lowerItem)) return "Pantry"
    if (/oil|vinegar|sauce|dressing|condiment/.test(lowerItem)) return "Condiments"
    if (/cookie|cake|ice cream|chocolate|candy/.test(lowerItem)) return "Snacks & Sweets"
    if (/water|soda|juice|coffee|tea/.test(lowerItem)) return "Beverages"

    return "Other"
  }

  function addItem() {
    if (!newItem.trim()) return

    const newItemObj = {
      name: newItem,
      category: categorizeItem(newItem),
    }

    setShoppingList([...shoppingList, newItemObj])
    setNewItem("")

    // Save to localStorage
    localStorage.setItem("shoppingList", JSON.stringify([...shoppingList, newItemObj]))

    toast({
      title: "Item added",
      description: `${newItem} added to your shopping list`,
    })
  }

  function removeItem(index) {
    const updatedList = [...shoppingList]
    const removedItem = updatedList[index]
    updatedList.splice(index, 1)
    setShoppingList(updatedList)

    // Remove from checked items if present
    const updatedCheckedItems = { ...checkedItems }
    delete updatedCheckedItems[removedItem.name]
    setCheckedItems(updatedCheckedItems)

    // Save to localStorage
    localStorage.setItem("shoppingList", JSON.stringify(updatedList))

    toast({
      title: "Item removed",
      description: `${removedItem.name} removed from your shopping list`,
    })
  }

  function toggleItemCheck(itemName) {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  function clearCheckedItems() {
    const uncheckedItems = shoppingList.filter((item) => !checkedItems[item.name])
    setShoppingList(uncheckedItems)
    setCheckedItems({})

    // Save to localStorage
    localStorage.setItem("shoppingList", JSON.stringify(uncheckedItems))

    toast({
      title: "Checked items cleared",
      description: "All checked items have been removed from your list",
    })
  }

  function printShoppingList() {
    window.print()
  }

  function downloadShoppingList() {
    // Group items by category
    const categorizedItems = {}
    shoppingList.forEach((item) => {
      if (!categorizedItems[item.category]) {
        categorizedItems[item.category] = []
      }
      categorizedItems[item.category].push(item.name)
    })

    // Create text content
    let content = "SHOPPING LIST\n\n"
    Object.entries(categorizedItems).forEach(([category, items]) => {
      content += `${category}:\n`
      items.forEach((item) => {
        content += `- ${item}\n`
      })
      content += "\n"
    })

    // Create download link
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "shopping-list.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "List downloaded",
      description: "Your shopping list has been downloaded as a text file",
    })
  }

  // Group items by category
  const itemsByCategory = {}
  shoppingList.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">Shopping List</h1>
          <p className="text-amber-600">Keep track of everything you need to buy</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-amber-200 hover:bg-amber-100 flex items-center gap-1"
            onClick={printShoppingList}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="border-amber-200 hover:bg-amber-100 flex items-center gap-1"
            onClick={downloadShoppingList}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 flex items-center gap-1" onClick={clearCheckedItems}>
            <Trash2 className="h-4 w-4" />
            Clear Checked
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {Object.keys(itemsByCategory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-medium text-amber-800 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {items.map((item, index) => {
                          const itemIndex = shoppingList.findIndex((i) => i.name === item.name)
                          return (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded-md ${
                                checkedItems[item.name] ? "bg-amber-50 line-through text-amber-400" : "bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`item-${itemIndex}`}
                                  checked={checkedItems[item.name] || false}
                                  onCheckedChange={() => toggleItemCheck(item.name)}
                                />
                                <Label
                                  htmlFor={`item-${itemIndex}`}
                                  className={checkedItems[item.name] ? "line-through text-amber-400" : ""}
                                >
                                  {item.name}
                                </Label>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeItem(itemIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-amber-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-amber-800 mb-1">Your shopping list is empty</h3>
                  <p className="text-amber-600 mb-4">Add items or generate a list from your meal plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-amber-200 mb-6">
            <CardHeader className="bg-amber-50 border-b border-amber-100 py-3">
              <CardTitle className="text-amber-800 text-lg">Add Items</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add an item..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="border-amber-200"
                />
                <Button onClick={addItem} disabled={!newItem.trim()} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Quick Add:</p>
                <div className="flex flex-wrap gap-1">
                  {["Milk", "Eggs", "Bread", "Butter", "Chicken", "Rice", "Pasta", "Onions", "Tomatoes", "Apples"].map(
                    (item) => (
                      <Button
                        key={item}
                        variant="outline"
                        size="sm"
                        className="text-xs border-amber-200 hover:bg-amber-100"
                        onClick={() => {
                          setNewItem(item)
                          setTimeout(() => addItem(), 100)
                        }}
                      >
                        {item}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100 py-3">
              <CardTitle className="text-amber-800 text-lg">Shopping Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mt-0.5"></span>
                  <span>Shop with a list to avoid impulse purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mt-0.5"></span>
                  <span>Check your pantry before shopping to avoid duplicates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mt-0.5"></span>
                  <span>Buy seasonal produce for better flavor and value</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mt-0.5"></span>
                  <span>Don't shop hungry - you'll buy more than you need</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
