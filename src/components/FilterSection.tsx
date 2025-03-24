"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Card, SegmentedButtons, Menu, Button, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface FilterSectionProps {
  onFilterChange: (type: string, yearRange: number[]) => void
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const theme = useTheme()
  const [type, setType] = useState("any")
  const [startYearMenuVisible, setStartYearMenuVisible] = useState(false)
  const [endYearMenuVisible, setEndYearMenuVisible] = useState(false)
  const [startYear, setStartYear] = useState<string>("")
  const [endYear, setEndYear] = useState<string>("")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString())

  const handleTypeChange = (newType: string) => {
    setType(newType)
    updateFilters(newType, startYear, endYear)
  }

  const handleStartYearChange = (year: string) => {
    setStartYear(year)
    setStartYearMenuVisible(false)
    updateFilters(type, year, endYear)
  }

  const handleEndYearChange = (year: string) => {
    setEndYear(year)
    setEndYearMenuVisible(false)
    updateFilters(type, startYear, year)
  }

  const updateFilters = (newType: string, start: string, end: string) => {
    const yearRange: number[] = []

    if (start && end) {
      const startNum = Number.parseInt(start)
      const endNum = Number.parseInt(end)

      if (!isNaN(startNum) && !isNaN(endNum) && startNum <= endNum) {
        yearRange.push(startNum, endNum)
      }
    }

    onFilterChange(newType, yearRange)
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Icon name="filter-variant" size={20} color={theme.colors.primary} />
          <Text style={styles.title}>Refine Your Search</Text>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.label}>Content Type</Text>
          <SegmentedButtons
            value={type}
            onValueChange={handleTypeChange}
            buttons={[
              { value: "any", label: "Any" },
              { value: "movie", label: "Movie" },
              { value: "series", label: "Series" },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        <View style={styles.yearContainer}>
          <View style={styles.yearField}>
            <Text style={styles.label}>Start Year</Text>
            <Menu
              visible={startYearMenuVisible}
              onDismiss={() => setStartYearMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setStartYearMenuVisible(true)} style={styles.yearButton}>
                  {startYear || "From year"}
                </Button>
              }
              style={styles.menu}
            >
              <Menu.Item onPress={() => handleStartYearChange("")} title="Any" />
              <View style={styles.menuDivider} />
              {years.map((year) => (
                <Menu.Item key={`start-${year}`} onPress={() => handleStartYearChange(year)} title={year} />
              ))}
            </Menu>
          </View>

          <View style={styles.yearField}>
            <Text style={styles.label}>End Year</Text>
            <Menu
              visible={endYearMenuVisible}
              onDismiss={() => setEndYearMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setEndYearMenuVisible(true)} style={styles.yearButton}>
                  {endYear || "To year"}
                </Button>
              }
              style={styles.menu}
            >
              <Menu.Item onPress={() => handleEndYearChange("")} title="Any" />
              <View style={styles.menuDivider} />
              {years.map((year) => (
                <Menu.Item key={`end-${year}`} onPress={() => handleEndYearChange(year)} title={year} />
              ))}
            </Menu>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  yearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  yearField: {
    width: "48%",
  },
  yearButton: {
    width: "100%",
  },
  menu: {
    maxHeight: 300,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 4,
  },
})

