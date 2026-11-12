#pragma once
#include <string>

enum class Category {
    Hostel,
    Academic,
    Food,
    Shopping,
    ATM,
    Medical,
    Sports,
    Market,
    Residence,
    Gate,
    Guesthouse
};

inline Category categoryFromString(const std::string& s) {
    if (s == "Hostel")    return Category::Hostel;
    if (s == "Academic")  return Category::Academic;
    if (s == "Food")      return Category::Food;
    if (s == "Shopping")  return Category::Shopping;
    if (s == "ATM")       return Category::ATM;
    if (s == "Medical")   return Category::Medical;
    if (s == "Sports")    return Category::Sports;
    if (s == "Market")    return Category::Market;
    if (s == "Residence") return Category::Residence;
    if (s == "Gate")      return Category::Gate;
    if (s == "Guesthouse")return Category::Guesthouse;
    return Category::Residence; // default
}

inline std::string categoryToString(Category c) {
    switch (c) {
        case Category::Hostel:     return "Hostel";
        case Category::Academic:   return "Academic";
        case Category::Food:       return "Food";
        case Category::Shopping:   return "Shopping";
        case Category::ATM:        return "ATM";
        case Category::Medical:    return "Medical";
        case Category::Sports:     return "Sports";
        case Category::Market:     return "Market";
        case Category::Residence:  return "Residence";
        case Category::Gate:       return "Gate";
        case Category::Guesthouse: return "Guesthouse";
    }
    return "Unknown";
}

struct Node {
    int         id;
    std::string name;
    Category    category;
    float       x, y, z;
};

struct Edge {
    int   from;
    int   to;
    float weight;
};
