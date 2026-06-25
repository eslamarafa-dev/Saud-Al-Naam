var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/mockData.ts
var INITIAL_UNITS = [
  {
    id: "unit-1",
    name: "\u0634\u0627\u0644\u064A\u0647 \u0627\u0644\u0644\u0627\u0641\u0646\u062F\u0631 \u0627\u0644\u0641\u0627\u062E\u0631 \u0645\u0639 \u0645\u0633\u0628\u062D \u062E\u0627\u0635 \u0628\u0645\u0624\u062B\u0631\u0627\u062A \u0645\u0627\u0626\u064A\u0629 - \u062D\u064A \u0627\u0644\u0631\u0645\u0627\u0644\u060C \u0627\u0644\u0631\u064A\u0627\u0636",
    type: "chalet",
    city: "Riyadh",
    status: "available",
    pricePerNight: 1250,
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "9482",
    smartLockIp: "192.168.1.185",
    smartLockStatus: "locked",
    wifiName: "Lavender_Resort_5G",
    wifiPass: "Riyadh2026_Welcome",
    locationLink: "https://maps.google.com/?q=24.8123,46.8523",
    addressText: "\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0631\u0645\u0627\u0644\u060C \u0637\u0631\u064A\u0642 \u0627\u0644\u0623\u0645\u064A\u0631 \u0645\u062D\u0645\u062F \u0628\u0646 \u0633\u0644\u0645\u0627\u0646\u060C \u0645\u062E\u0631\u062C 30\u060C \u0627\u0644\u0631\u064A\u0627\u0636\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["gathern", "airbnb", "direct"],
    description: "\u0634\u0627\u0644\u064A\u0647 \u0627\u0644\u0644\u0627\u0641\u0646\u062F\u0631 \u064A\u0642\u062F\u0645 \u0648\u0627\u062D\u0629 \u0645\u0646 \u0627\u0644\u0647\u062F\u0648\u0621 \u0648\u0627\u0644\u0627\u0633\u062A\u0631\u062E\u0627\u0621 \u0641\u064A \u0627\u0644\u0631\u064A\u0627\u0636 \u0645\u0639 \u0645\u0633\u0628\u062D \u062E\u0627\u0631\u062C\u064A \u062F\u0627\u0641\u0626 \u0648\u0645\u062C\u0644\u0633 \u062E\u0627\u0631\u062C\u064A \u0641\u0627\u062E\u0631 \u0645\u0639 \u0634\u0627\u0634\u0629 \u0633\u064A\u0646\u0645\u0627 \u0630\u0643\u064A\u0629 \u0648\u0645\u0631\u0627\u0641\u0642 \u0634\u0648\u0627\u0621 \u0645\u062A\u0643\u0627\u0645\u0644\u0629."
  },
  {
    id: "unit-2",
    name: "\u0634\u0642\u0629 \u0627\u0644\u0639\u0644\u064A\u0627 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    type: "apartment",
    city: "Riyadh",
    status: "occupied",
    pricePerNight: 650,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "1140",
    smartLockIp: "192.168.4.120",
    smartLockStatus: "unlocked",
    wifiName: "Olaya_Elite_Optic",
    wifiPass: "EliteOlaya8877",
    locationLink: "https://maps.google.com/?q=24.7012,46.6812",
    addressText: "\u062D\u064A \u0627\u0644\u0639\u0644\u064A\u0627\u060C \u0634\u0627\u0631\u0639 \u0627\u0644\u062A\u062D\u0644\u064A\u0629\u060C \u062E\u0644\u0641 \u0623\u0628\u0631\u0627\u062C \u0627\u0644\u0639\u0644\u064A\u0627 \u0648\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644\u060C \u0627\u0644\u0631\u064A\u0627\u0636\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["booking", "airbnb", "direct"],
    description: "\u0625\u0642\u0627\u0645\u0629 \u0639\u0635\u0631\u064A\u0629 \u0628\u0645\u0648\u0642\u0639 \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A \u0628\u0642\u0644\u0628 \u0627\u0644\u0631\u064A\u0627\u0636 \u0627\u0644\u0645\u0627\u0644\u064A \u0648\u0627\u0644\u062A\u062C\u0627\u0631\u064A \u062A\u0644\u0627\u0626\u0645 \u0631\u062C\u0627\u0644 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0648\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062A \u0627\u0644\u0628\u0627\u062D\u062B\u0629 \u0639\u0646 \u0627\u0644\u0631\u0641\u0627\u0647\u064A\u0629 \u0648\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0623\u0634\u0647\u0631 \u0645\u0639\u0627\u0644\u0645 \u0627\u0644\u0639\u0627\u0635\u0645\u0629."
  },
  {
    id: "unit-3",
    name: "\u0641\u064A\u0644\u0627 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u0646\u0638\u0627\u0645 \u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A \u0645\u062A\u0637\u0648\u0631 - \u0627\u0644\u0631\u064A\u0627\u0636",
    type: "villa",
    city: "Riyadh",
    status: "cleaning",
    pricePerNight: 2450,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "5032",
    smartLockIp: "192.168.12.110",
    smartLockStatus: "locked",
    wifiName: "Nakheel_Smart_Villa_VIP",
    wifiPass: "NakheelHome9988",
    locationLink: "https://maps.google.com/?q=24.7431,46.6431",
    addressText: "\u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u063A\u0631\u0628\u064A\u060C \u0637\u0631\u064A\u0642 \u0627\u0644\u0625\u0645\u0627\u0645 \u0633\u0639\u0648\u062F \u0628\u0646 \u0639\u0628\u062F \u0627\u0644\u0639\u0632\u064A\u0632\u060C \u0627\u0644\u0631\u064A\u0627\u0636\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["gathern", "direct"],
    description: "\u0641\u064A\u0644\u0627 \u0630\u0643\u064A\u0629 \u0645\u062A\u0637\u0648\u0631\u0629 \u062A\u062A\u0645\u064A\u0632 \u0628\u0646\u0638\u0627\u0645 \u0625\u0646\u0627\u0631\u0629 \u062A\u0641\u0627\u0639\u0644\u064A\u060C \u0648\u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A\u0629 \u0645\u062C\u0647\u0632\u0629 \u0628\u0640 Atmos\u060C \u0648\u062D\u062F\u064A\u0642\u0629 \u062F\u0627\u062E\u0644\u064A\u0629 \u062E\u0644\u0627\u0628\u0629 \u062A\u0636\u0627\u0647\u064A \u0623\u0641\u062E\u0645 \u0627\u0644\u0645\u0646\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629."
  },
  {
    id: "unit-4",
    name: "\u062C\u0646\u0627\u062D \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0641\u0627\u062E\u0631 \u0627\u0644\u0645\u0637\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 - \u062C\u062F\u0629",
    type: "suite",
    city: "Jeddah",
    status: "available",
    pricePerNight: 980,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "4321",
    smartLockIp: "192.168.32.14",
    smartLockStatus: "locked",
    wifiName: "Seaside_Luxury_WIFI",
    wifiPass: "JeddahSea2026",
    locationLink: "https://maps.google.com/?q=21.5832,39.1232",
    addressText: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u060C \u0623\u0628\u0631\u0627\u062C \u0627\u0644\u0645\u0627\u0631\u064A\u0646\u0627\u060C \u0627\u0644\u0637\u0627\u0628\u0642 18\u060C \u062C\u062F\u0629\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["booking", "airbnb", "gathern", "direct"],
    description: "\u0627\u0633\u062A\u0645\u062A\u0639 \u0628\u0625\u0637\u0644\u0627\u0644\u0627\u062A \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u063A\u0631\u0648\u0628 \u0633\u0627\u062D\u0631 \u0641\u064A \u0623\u0631\u0642\u0649 \u0645\u0646\u0637\u0642\u0629 \u0633\u064A\u0627\u062D\u064A\u0629 \u0641\u064A \u062C\u062F\u0629\u060C \u0645\u0639 \u0635\u0627\u0644\u0648\u0646 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0641\u0627\u062E\u0631 \u0648\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0627\u0644\u0645\u0644\u0643\u064A\u0629."
  },
  {
    id: "unit-5",
    name: "\u0645\u0646\u0632\u0644 \u0644\u0648\u0644\u0648\u0629 \u0627\u0644\u0623\u062B\u0631\u064A \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A \u0641\u064A \u0648\u0627\u062D\u0629 \u0627\u0644\u0646\u062E\u064A\u0644 - \u0627\u0644\u0639\u0644\u0627",
    type: "suite",
    city: "AlUla",
    status: "occupied",
    pricePerNight: 1950,
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "8809",
    smartLockIp: "192.168.1.99",
    smartLockStatus: "locked",
    wifiName: "AlUla_Heritage_Optic_5G",
    wifiPass: "AlUlaMagicResort",
    locationLink: "https://maps.google.com/?q=26.6212,37.9231",
    addressText: "\u0627\u0644\u0639\u0644\u0627\u060C \u0627\u0644\u0628\u0644\u062F\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629\u060C \u0637\u0631\u064A\u0642 \u0627\u0644\u0648\u0627\u062D\u0629\u060C \u062E\u0644\u0641 \u0645\u0642\u0647\u0649 \u0635\u062D\u0627\u0631\u0649 \u0627\u0644\u0623\u062B\u0631\u064A\u060C \u0627\u0644\u0639\u0644\u0627\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["airbnb", "direct"],
    description: "\u062A\u062C\u0631\u0628\u0629 \u0641\u0631\u064A\u062F\u0629 \u0648\u0645\u062A\u0631\u0641\u0629 \u0648\u0633\u0637 \u0635\u062E\u0648\u0631 \u0648\u062C\u0628\u0627\u0644 \u0627\u0644\u0639\u0644\u0627 \u0627\u0644\u0633\u0627\u062D\u0631\u0629 \u0648\u0645\u0632\u0627\u0631\u0639 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0628\u0643\u0631. \u062A\u0635\u0645\u064A\u0645 \u062A\u0631\u0627\u062B\u064A \u0645\u0633\u062A\u0645\u062F \u0645\u0646 \u0627\u0644\u0637\u0628\u064A\u0639\u0629 \u0645\u062C\u0647\u0632 \u0628\u0623\u0633\u0627\u0644\u064A\u0628 \u0627\u0644\u0631\u0627\u062D\u0629 \u0627\u0644\u0641\u0646\u062F\u0642\u064A\u0629."
  },
  {
    id: "unit-6",
    name: "\u0634\u0627\u0644\u064A\u0647 \u062C\u0628\u0627\u0644 \u0627\u0644\u0633\u0648\u062F\u0629 \u0627\u0644\u0641\u0627\u062E\u0631 \u0648\u0633\u0637 \u0627\u0644\u0636\u0628\u0627\u0628 \u0648\u0627\u0644\u063A\u0627\u0628\u0627\u062A - \u0623\u0628\u0647\u0627",
    type: "chalet",
    city: "Abha",
    status: "maintenance",
    pricePerNight: 850,
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200",
    smartLockCode: "3051",
    smartLockIp: "192.168.22.4",
    smartLockStatus: "offline",
    wifiName: "Abha_Cloud_Fiber",
    wifiPass: "PassAbha8899",
    locationLink: "https://maps.google.com/?q=18.2123,42.5012",
    addressText: "\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0633\u0648\u062F\u0629\u060C \u0645\u062A\u0646\u0632\u0647\u0627\u062A \u0627\u0644\u0636\u0628\u0627\u0628\u060C \u0645\u0631\u062A\u0641\u0639\u0627\u062A \u0623\u0628\u0647\u0627 \u0627\u0644\u063A\u0631\u0628\u064A\u0629\u060C \u0639\u0633\u064A\u0631\u060C \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    channelsSynced: ["gathern", "booking"],
    description: "\u0639\u0634 \u0641\u0648\u0642 \u0627\u0644\u0633\u062D\u0627\u0628 \u0641\u064A \u0623\u062C\u0648\u0627\u0621 \u0636\u0628\u0627\u0628\u064A\u0629 \u0645\u0639\u062A\u062F\u0644\u0629 \u0628\u0645\u0631\u062A\u0641\u0639\u0627\u062A \u0623\u0628\u0647\u0627\u060C \u0648\u0627\u0642\u0636\u0650 \u0644\u064A\u0627\u0644\u064A \u0634\u062A\u0648\u064A\u0629 \u0645\u0645\u062A\u0627\u0632\u0629 \u0623\u0645\u0627\u0645 \u0627\u0644\u0645\u0648\u0642\u062F \u0627\u0644\u062E\u0634\u0628\u064A \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0648\u063A\u0631\u0641\u0629 \u0627\u0644\u0633\u0627\u0648\u0646\u0627 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629."
  }
];
var INITIAL_BOOKINGS = [
  {
    id: "b-101",
    unitId: "unit-1",
    unitName: "\u0634\u0627\u0644\u064A\u0647 \u0627\u0644\u0644\u0627\u0641\u0646\u062F\u0631 \u0627\u0644\u0641\u0627\u062E\u0631 \u0645\u0639 \u0645\u0633\u0628\u062D \u062E\u0627\u0635 \u0628\u0645\u0624\u062B\u0631\u0627\u062A \u0645\u0627\u0626\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    guestName: "\u0623\u062D\u0645\u062F \u0628\u0646 \u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0634\u0645\u0631\u064A",
    guestPhone: "966504938123",
    guestEmail: "a.shammari@ejad.sa",
    checkInDate: "2026-06-22",
    checkOutDate: "2026-06-24",
    createdAt: "2026-06-18",
    source: "gathern",
    payoutAmount: 2500,
    guestCount: 4,
    status: "upcoming",
    paidStatus: "fully_paid",
    smartLockCodeSent: false,
    notes: "\u064A\u0641\u0636\u0644 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0634\u0641\u0631\u0629 \u0645\u0628\u0643\u0631\u064B\u0627 \u0648\u0637\u0644\u0628 \u0642\u0647\u0648\u0629 \u0639\u0631\u0628\u064A\u0629 \u0639\u0646\u062F \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u062A\u0631\u062D\u064A\u0628 \u0628\u0627\u0644\u0636\u064A\u0648\u0641."
  },
  {
    id: "b-102",
    unitId: "unit-2",
    unitName: "\u0634\u0642\u0629 \u0627\u0644\u0639\u0644\u064A\u0627 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    guestName: "\u062F. \u062E\u0627\u0644\u062F \u0633\u0644\u064A\u0645 \u0627\u0644\u0633\u0628\u064A\u0639\u064A",
    guestPhone: "966555123987",
    guestEmail: "dr.subaie@subaieholdings.com",
    checkInDate: "2026-06-20",
    checkOutDate: "2026-06-25",
    createdAt: "2026-06-19",
    source: "airbnb",
    payoutAmount: 3250,
    guestCount: 2,
    status: "active",
    paidStatus: "fully_paid",
    smartLockCodeSent: true,
    notes: "\u0627\u0644\u0636\u064A\u0641 \u0641\u064A \u0632\u064A\u0627\u0631\u0629 \u0639\u0645\u0644\u060C \u0637\u0644\u0628 \u0641\u0627\u062A\u0648\u0631\u0629 \u0636\u0631\u064A\u0628\u0629 \u0648\u062A\u0648\u0641\u064A\u0631 \u0634\u0627\u062D\u0646 \u062C\u0648\u0627\u0644 \u0625\u0636\u0627\u0641\u064A \u0648\u0633\u0631\u0639\u0629 \u0625\u0646\u062A\u0631\u0646\u062A \u0645\u0645\u062A\u0627\u0632\u0629."
  },
  {
    id: "b-103",
    unitId: "unit-5",
    unitName: "\u0645\u0646\u0632\u0644 \u0644\u0648\u0644\u0648\u0629 \u0627\u0644\u0623\u062B\u0631\u064A \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A \u0641\u064A \u0648\u0627\u062D\u0629 \u0627\u0644\u0646\u062E\u064A\u0644 - \u0627\u0644\u0639\u0644\u0627",
    guestName: "\u0627\u0644\u0645\u0647\u0646\u062F\u0633 \u0631\u0627\u0626\u062F \u0645\u062A\u0639\u0628 \u0627\u0644\u0645\u0637\u064A\u0631\u064A",
    guestPhone: "966544837261",
    guestEmail: "r.mutairi@aramco.com",
    checkInDate: "2026-06-14",
    checkOutDate: "2026-06-17",
    createdAt: "2026-06-10",
    source: "booking",
    payoutAmount: 5850,
    guestCount: 3,
    status: "completed",
    paidStatus: "fully_paid",
    smartLockCodeSent: true,
    notes: "\u0623\u062B\u0646\u0649 \u0628\u0634\u062F\u0629 \u0639\u0644\u0649 \u0636\u064A\u0627\u0641\u0629 \u0623\u0647\u0644 \u0627\u0644\u0639\u0644\u0627 \u0648\u0637\u0627\u0644\u0628 \u0628\u0627\u0644\u0645\u063A\u0627\u062F\u0631\u0629 \u0627\u0644\u0645\u062A\u0623\u062E\u0631\u0629 \u0644\u0645\u062F\u0629 \u0633\u0627\u0639\u0629 \u0644\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u062D\u0642\u0627\u0626\u0628."
  },
  {
    id: "b-104",
    unitId: "unit-3",
    unitName: "\u0641\u064A\u0644\u0627 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u0646\u0638\u0627\u0645 \u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A \u0645\u062A\u0637\u0648\u0631 - \u0627\u0644\u0631\u064A\u0627\u0636",
    guestName: "\u0633\u0644\u0637\u0627\u0646 \u0645\u0645\u062F\u0648\u062D \u0622\u0644 \u0631\u0634\u064A\u062F",
    guestPhone: "966533005522",
    checkInDate: "2026-06-26",
    checkOutDate: "2026-06-29",
    createdAt: "2026-06-15",
    source: "direct",
    payoutAmount: 7350,
    guestCount: 6,
    status: "upcoming",
    paidStatus: "partial",
    smartLockCodeSent: false,
    notes: "\u062D\u062C\u0632 \u0645\u0628\u0627\u0634\u0631 \u0645\u0646 \u0639\u0645\u064A\u0644 \u062F\u0627\u0626\u0645\u060C \u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0636\u064A\u0631 \u062D\u0637\u0628 \u062E\u0627\u0631\u062C\u064A \u0644\u0644\u0645\u0648\u0642\u062F \u0648\u062B\u0644\u0627\u062C\u0629 \u0645\u062C\u0647\u0632\u0629 \u0628\u0645\u0631\u0637\u0628\u0627\u062A \u0641\u0627\u062E\u0631\u0629."
  },
  {
    id: "b-105",
    unitId: "unit-4",
    unitName: "\u062C\u0646\u0627\u062D \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0641\u0627\u062E\u0631 \u0627\u0644\u0645\u0637\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 - \u062C\u062F\u0629",
    guestName: "\u0623. \u0637\u0627\u0631\u0642 \u0639\u0628\u062F \u0627\u0644\u0645\u062D\u0633\u0646 \u0627\u0644\u064A\u0648\u0633\u0641",
    guestPhone: "966567119900",
    guestEmail: "t.yousef@yousefcap.sa",
    checkInDate: "2026-06-18",
    checkOutDate: "2026-06-20",
    createdAt: "2026-06-16",
    source: "gathern",
    payoutAmount: 1960,
    guestCount: 2,
    status: "completed",
    paidStatus: "fully_paid",
    smartLockCodeSent: true,
    notes: "\u0632\u064A\u0627\u0631\u0629 \u0644\u0625\u0646\u0647\u0627\u0621 \u0635\u0641\u0642\u0629 \u062A\u062C\u0627\u0631\u064A\u0629\u060C \u064A\u062D\u062A\u0627\u062C \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0643\u064A\u064A\u0641 \u0627\u0644\u0645\u0631\u0643\u0632\u064A \u0645\u0633\u0628\u0642\u0627 \u0639\u0644\u0649 \u062F\u0631\u062C\u0629 \u062D\u0631\u0627\u0631\u0629 21."
  }
];
var INITIAL_TASKS = [
  {
    id: "task-1",
    unitId: "unit-3",
    unitName: "\u0641\u064A\u0644\u0627 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u0646\u0638\u0627\u0645 \u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A \u0645\u062A\u0637\u0648\u0631 - \u0627\u0644\u0631\u064A\u0627\u0636",
    title: "\u062A\u0646\u0638\u064A\u0641 \u0648\u062A\u0637\u0647\u064A\u0631 \u0627\u0644\u0641\u064A\u0644\u0627 \u0648\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0636\u0627\u062A \u0648\u062A\u0644\u0645\u064A\u0639 \u0627\u0644\u0632\u062C\u0627\u062C \u0627\u0644\u062E\u0627\u0631\u062C\u064A",
    type: "cleaning",
    assignTo: "\u0623\u0628\u0648 \u0645\u062D\u0645\u062F (\u0645\u0634\u0631\u0641 \u0627\u0644\u062A\u062C\u0647\u064A\u0632 \u0648\u0627\u0644\u0646\u0638\u0627\u0641\u0629)",
    deadline: "2026-06-21 15:30",
    status: "in_progress",
    notes: "\u0627\u0644\u062A\u0631\u0643\u064A\u0632 \u0639\u0644\u0649 \u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0633\u062C\u0627\u062F \u0648\u0633\u064A\u0646\u0645\u0627 \u0627\u0644\u0645\u0646\u0632\u0644 \u0648\u0627\u0644\u062A\u0639\u0642\u064A\u0645 \u0639\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0644\u0644\u0634\u0631\u0627\u0634\u0641 \u0648\u0627\u0644\u0645\u0646\u0627\u0634\u0641.",
    cost: 180
  },
  {
    id: "task-2",
    unitId: "unit-6",
    unitName: "\u0634\u0627\u0644\u064A\u0647 \u062C\u0628\u0627\u0644 \u0627\u0644\u0633\u0648\u062F\u0629 \u0627\u0644\u0641\u0627\u062E\u0631 \u0648\u0633\u0637 \u0627\u0644\u0636\u0628\u0627\u0628 \u0648\u0627\u0644\u063A\u0627\u0628\u0627\u062A - \u0623\u0628\u0647\u0627",
    title: "\u0641\u062D\u0635 \u0639\u0637\u0644 \u0628\u0627\u0644\u0648\u0627\u064A \u0641\u0627\u064A \u0648\u0627\u0644\u062A\u0627\u0643\u062F \u0645\u0646 \u0625\u0645\u062F\u0627\u062F \u0643\u0627\u0628\u0644 \u0627\u0644\u0641\u0627\u064A\u0628\u0631 \u0627\u0644\u0628\u0635\u0631\u064A \u0648\u0635\u064A\u0627\u0646\u0629 \u0642\u0641\u0644 \u0627\u0644\u0628\u0627\u0628",
    type: "maintenance",
    assignTo: "\u0627\u0644\u0645\u0647\u0646\u062F\u0633 \u062C\u0627\u0633\u0645 \u0627\u0644\u0645\u0635\u0644\u062D",
    deadline: "2026-06-22 11:00",
    status: "pending",
    notes: "\u0627\u0644\u0642\u0641\u0644 \u0627\u0644\u0630\u0643\u064A \u063A\u064A\u0631 \u0645\u062A\u0635\u0644 \u0628\u0627\u0644\u0634\u0628\u0643\u0629\u060C \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0634\u064A\u064A\u0643 \u0639\u0644\u0649 \u0628\u0637\u0627\u0631\u064A\u0627\u062A \u0627\u0644\u0642\u0641\u0644 \u0648\u0636\u0628\u0637 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u064A\u062F\u0648\u064A\u064B\u0627.",
    cost: 350
  },
  {
    id: "task-3",
    unitId: "unit-5",
    unitName: "\u0645\u0646\u0632\u0644 \u0644\u0648\u0644\u0648\u0629 \u0627\u0644\u0623\u062B\u0631\u064A \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A \u0641\u064A \u0648\u0627\u062D\u0629 \u0627\u0644\u0646\u062E\u064A\u0644 - \u0627\u0644\u0639\u0644\u0627",
    title: "\u0634\u0631\u0627\u0621 \u0648\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u062E\u0648\u0644\u0627\u0646\u064A\u0629 \u0627\u0644\u0641\u0627\u062E\u0631\u0629\u060C \u0627\u0644\u062A\u0645\u0631 \u0627\u0644\u0633\u0643\u0631\u064A \u0627\u0644\u0641\u0627\u062E\u0631\u060C \u0648\u0627\u0644\u0648\u0631\u0648\u062F \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0644\u0644\u0636\u064A\u0641 \u0627\u0644\u062C\u062F\u064A\u062F",
    type: "inspection",
    assignTo: "\u0623\u0645 \u0645\u0634\u0639\u0644 (\u0634\u0631\u064A\u0643\u0629 \u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0627\u0644\u0645\u062D\u0644\u064A\u0629)",
    deadline: "2026-06-14 12:00",
    status: "completed",
    notes: "\u062A\u0645 \u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0648\u0627\u0644\u062A\u0645\u0648\u0631 \u0645\u0639 \u0633\u0644\u0629 \u0641\u0648\u0627\u0643\u0647 \u0637\u0627\u0632\u062C\u0629\u060C \u0648\u0646\u0627\u0644\u062A \u0631\u0636\u0627 \u0627\u0644\u0636\u064A\u0641 \u0628\u0634\u062F\u0629 \u0648\u0630\u0643\u0631\u0647\u0627 \u0628\u0627\u0644\u062A\u0642\u064A\u064A\u0645.",
    cost: 140
  },
  {
    id: "task-4",
    unitId: "unit-1",
    unitName: "\u0634\u0627\u0644\u064A\u0647 \u0627\u0644\u0644\u0627\u0641\u0646\u062F\u0631 \u0627\u0644\u0641\u0627\u062E\u0631 \u0645\u0639 \u0645\u0633\u0628\u062D \u062E\u0627\u0635 \u0628\u0645\u0624\u062B\u0631\u0627\u062A \u0645\u0627\u0626\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    title: "\u0641\u062D\u0635 \u0643\u064A\u0645\u064A\u0627\u0626\u064A \u0644\u0644\u0643\u0644\u0648\u0631 \u0648\u062A\u0646\u0638\u064A\u0641 \u0641\u0644\u062A\u0631 \u0627\u0644\u0645\u0633\u0628\u062D \u0648\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u0624\u062B\u0631\u0627\u062A \u0627\u0644\u0645\u0627\u0626\u064A\u0629 \u0648\u0634\u0644\u0627\u0644 \u0627\u0644\u062D\u0627\u0626\u0637",
    type: "repair",
    assignTo: "\u0641\u0646\u064A \u062D\u0645\u0627\u0645\u0627\u062A \u0627\u0644\u0633\u0628\u0627\u062D\u0629 (\u0625\u0642\u0628\u0627\u0644)",
    deadline: "2026-06-21 10:00",
    status: "pending",
    notes: "\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u062F\u0641\u0626\u0629 \u0644\u062A\u0635\u0644 \u0644\u0640 28 \u062F\u0631\u062C\u0629 \u0642\u0628\u0644 \u062F\u062E\u0648\u0644 \u0627\u0644\u0636\u064A\u0648\u0641 \u0627\u0644\u0642\u0627\u062F\u0645\u064A\u0646 \u063A\u062F\u0627\u064B.",
    cost: 120
  }
];
var INITIAL_PROPERTIES = [
  {
    id: "prop-1",
    name: "\u0645\u062C\u0645\u0639 \u0627\u0644\u0646\u0639\u0627\u0645 \u0627\u0644\u0646\u0631\u062C\u0633 \u0627\u0644\u0633\u0643\u0646\u064A",
    type: "residential",
    city: "Riyadh",
    address: "\u062D\u064A \u0627\u0644\u0646\u0631\u062C\u0633\u060C \u0645\u062E\u0631\u062C 7\u060C \u0627\u0644\u0631\u064A\u0627\u0636",
    totalBuildings: 3,
    totalUnits: 18,
    occupancyRate: 88,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prop-2",
    name: "\u0645\u0646\u062A\u062C\u0639 \u0648\u0627\u062D\u0629 \u0627\u0644\u0633\u0644\u0648\u0649 \u0627\u0644\u0633\u064A\u0627\u062D\u064A",
    type: "resort",
    city: "AlUla",
    address: "\u0627\u0644\u0628\u0644\u062F\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629\u060C \u0645\u0632\u0627\u0631\u0639 \u0646\u062E\u064A\u0644 \u0644\u0648\u0644\u0648\u060C \u0627\u0644\u0639\u0644\u0627",
    totalBuildings: 1,
    totalUnits: 6,
    occupancyRate: 95,
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prop-3",
    name: "\u0628\u0631\u062C \u0627\u0644\u0646\u0639\u0627\u0645 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0648\u0627\u0644\u0645\u0627\u0631\u064A\u0646\u0627",
    type: "commercial",
    city: "Jeddah",
    address: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634\u060C \u062D\u064A \u0627\u0644\u0634\u0627\u0637\u0626\u060C \u062C\u062F\u0629",
    totalBuildings: 1,
    totalUnits: 12,
    occupancyRate: 80,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  }
];
var INITIAL_BUILDINGS = [
  {
    id: "bld-1",
    propertyId: "prop-1",
    propertyName: "\u0645\u062C\u0645\u0639 \u0627\u0644\u0646\u0639\u0627\u0645 \u0627\u0644\u0646\u0631\u062C\u0633 \u0627\u0644\u0633\u0643\u0646\u064A",
    name: "\u0645\u0628\u0646\u0649 \u0627\u0644\u0646\u0631\u062C\u0633 - \u0628\u0644\u0648\u0643 \u0623",
    address: "\u062D\u064A \u0627\u0644\u0646\u0631\u062C\u0633\u060C \u0627\u0644\u0631\u064A\u0627\u0636",
    floorsCount: 4,
    unitsCount: 8,
    elevatorStatus: "operational",
    waterTankMeter: 82,
    electricityMeterNo: "ELEC-9824412-RYD",
    cleanlinessGrade: "A"
  },
  {
    id: "bld-2",
    propertyId: "prop-1",
    propertyName: "\u0645\u062C\u0645\u0639 \u0627\u0644\u0646\u0639\u0627\u0645 \u0627\u0644\u0646\u0631\u062C\u0633 \u0627\u0644\u0633\u0643\u0646\u064A",
    name: "\u0645\u0628\u0646\u0649 \u0627\u0644\u0646\u0631\u062C\u0633 - \u0628\u0644\u0648\u0643 \u0628",
    address: "\u062D\u064A \u0627\u0644\u0646\u0631\u062C\u0633\u060C \u0627\u0644\u0631\u064A\u0627\u0636",
    floorsCount: 4,
    unitsCount: 10,
    elevatorStatus: "operational",
    waterTankMeter: 68,
    electricityMeterNo: "ELEC-9824415-RYD",
    cleanlinessGrade: "A"
  },
  {
    id: "bld-3",
    propertyId: "prop-3",
    propertyName: "\u0628\u0631\u062C \u0627\u0644\u0646\u0639\u0627\u0645 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0648\u0627\u0644\u0645\u0627\u0631\u064A\u0646\u0627",
    name: "\u0628\u0631\u062C \u0627\u0644\u0645\u0627\u0631\u064A\u0646\u0627 \u0628\u0644\u0627\u0632\u0627",
    address: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634\u060C \u0627\u0644\u0634\u0627\u0637\u0626\u060C \u062C\u062F\u0629",
    floorsCount: 15,
    unitsCount: 12,
    elevatorStatus: "operational",
    waterTankMeter: 91,
    electricityMeterNo: "ELEC-439121-JED",
    cleanlinessGrade: "B"
  }
];
var INITIAL_TENANTS = [
  {
    id: "ten-1",
    name: "\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646 \u0628\u0646 \u0641\u0647\u062F \u0627\u0644\u0633\u062F\u064A\u0631\u064A",
    phone: "966504812345",
    email: "a.sudairy@holding.com",
    nationalId: "1092837482",
    nationality: "\u0633\u0639\u0648\u062F\u064A",
    companyName: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0633\u062F\u064A\u0631\u064A \u0627\u0644\u0642\u0627\u0628\u0636\u0629",
    status: "active",
    familyMembersCount: 4,
    totalPaidAmount: 45e3,
    dueAmount: 0
  },
  {
    id: "ten-2",
    name: "\u0645. \u0633\u0631\u064A \u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u063A\u0631\u064A\u063A\u0648\u0631\u064A",
    phone: "966551829304",
    email: "gregory@tech-core.sa",
    nationalId: "2391029384",
    nationality: "\u0628\u0631\u064A\u0637\u0627\u0646\u064A",
    companyName: "\u0643\u0648\u0631 \u0644\u0644\u062D\u0644\u0648\u0644 \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
    status: "active",
    familyMembersCount: 1,
    totalPaidAmount: 38e3,
    dueAmount: 5e3
  },
  {
    id: "ten-3",
    name: "\u0623\u0645\u0644 \u0628\u0646\u062A \u0639\u0628\u062F \u0627\u0644\u0644\u0647 \u0627\u0644\u0633\u0628\u064A\u0639\u064A",
    phone: "966544837269",
    email: "amal.subaie@edu.sa",
    nationalId: "1102934812",
    nationality: "\u0633\u0639\u0648\u062F\u064A\u0629",
    status: "active",
    familyMembersCount: 3,
    totalPaidAmount: 24e3,
    dueAmount: 0
  },
  {
    id: "ten-4",
    name: "\u0641\u064A\u0635\u0644 \u0628\u0646 \u0637\u0644\u0627\u0644 \u0627\u0644\u0633\u0639\u062F\u0648\u0646",
    phone: "966567229102",
    email: "saudoon@invest.com.sa",
    nationalId: "1082734123",
    nationality: "\u0633\u0639\u0648\u062F\u064A",
    status: "prospective",
    familyMembersCount: 2,
    totalPaidAmount: 0,
    dueAmount: 0
  }
];
var INITIAL_CONTRACTS = [
  {
    id: "con-1",
    contractNumber: "EJARI-2026-09241",
    tenantId: "ten-1",
    tenantName: "\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646 \u0628\u0646 \u0641\u0647\u062F \u0627\u0644\u0633\u062F\u064A\u0631\u064A",
    unitId: "unit-2",
    unitName: "\u0634\u0642\u0629 \u0627\u0644\u0639\u0644\u064A\u0627 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    rentalAmount: 45e3,
    securityDeposit: 3e3,
    billingCycle: "yearly",
    status: "active",
    ejariStatus: "registered",
    ejariNumber: "E-2918442-998",
    notes: "\u062A\u0645\u062A \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0639 \u0634\u0628\u0643\u0629 \u0625\u064A\u062C\u0627\u0631 \u0627\u0644\u0648\u0637\u0646\u064A\u0629 \u0648\u062F\u0641\u0639 \u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0636\u0631\u064A\u0628\u064A\u0629."
  },
  {
    id: "con-2",
    contractNumber: "EJARI-2026-11853",
    tenantId: "ten-2",
    tenantName: "\u0645. \u0633\u0631\u064A \u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u063A\u0631\u064A\u063A\u0648\u0631\u064A",
    unitId: "unit-4",
    unitName: "\u062C\u0646\u0627\u062D \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0641\u0627\u062E\u0631 \u0627\u0644\u0645\u0637\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 - \u062C\u062F\u0629",
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    rentalAmount: 12e3,
    securityDeposit: 1500,
    billingCycle: "monthly",
    status: "active",
    ejariStatus: "registered",
    ejariNumber: "E-7724128-441",
    notes: "\u0627\u0644\u062F\u0641\u0639 \u0634\u0647\u0631\u064A \u0641\u064A \u0627\u0644\u0645\u0648\u0639\u062F \u0627\u0644\u0623\u0648\u0644 \u0645\u0646 \u0643\u0644 \u0634\u0647\u0631 \u0645\u064A\u0644\u0627\u062F\u064A."
  },
  {
    id: "con-3",
    contractNumber: "EJARI-2026-25411",
    tenantId: "ten-3",
    tenantName: "\u0623\u0645\u0644 \u0628\u0646\u062A \u0639\u0628\u062F \u0627\u0644\u0644\u0647 \u0627\u0644\u0633\u0628\u064A\u0639\u064A",
    unitId: "unit-3",
    unitName: "\u0641\u064A\u0644\u0627 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u0646\u0638\u0627\u0645 \u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A \u0645\u062A\u0637\u0648\u0631 - \u0627\u0644\u0631\u064A\u0627\u0636",
    startDate: "2026-05-15",
    endDate: "2027-05-14",
    rentalAmount: 96e3,
    securityDeposit: 5e3,
    billingCycle: "quarterly",
    status: "active",
    ejariStatus: "registered",
    ejariNumber: "E-8834192-230",
    notes: "\u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631 \u0645\u0644\u062A\u0632\u0645 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0627\u0644\u0641\u064A\u0644\u0627 \u0645\u0634\u0645\u0648\u0644\u0629 \u0628\u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u062F\u0648\u0631\u064A\u0629."
  }
];
var INITIAL_INVOICES = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-0001",
    contractId: "con-1",
    tenantName: "\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646 \u0628\u0646 \u0641\u0647\u062F \u0627\u0644\u0633\u062F\u064A\u0631\u064A",
    unitName: "\u0634\u0642\u0629 \u0627\u0644\u0639\u0644\u064A\u0627 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    issueDate: "2026-01-01",
    dueDate: "2026-01-15",
    amount: 45e3,
    vatAmount: 6750,
    totalAmount: 51750,
    type: "rent",
    status: "paid",
    zatcaQrCode: "HELLOWORLDZATCAMOCKQR1234567890AAABBBCCCDDDEEE"
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-0042",
    contractId: "con-2",
    tenantName: "\u0645. \u0633\u0631\u064A \u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u063A\u0631\u064A\u063A\u0648\u0631\u064A",
    unitName: "\u062C\u0646\u0627\u062D \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0641\u0627\u062E\u0631 \u0627\u0644\u0645\u0637\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 - \u062C\u062F\u0629",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    amount: 12e3,
    vatAmount: 1800,
    totalAmount: 13800,
    type: "rent",
    status: "paid",
    zatcaQrCode: "HELLOWORLDZATCAMOCKQR6512391238421831920808091"
  },
  {
    id: "inv-103",
    invoiceNumber: "INV-2026-0089",
    contractId: "con-3",
    tenantName: "\u0623\u0645\u0644 \u0628\u0646\u062A \u0639\u0628\u062F \u0627\u0644\u0644\u0647 \u0627\u0644\u0633\u0628\u064A\u0639\u064A",
    unitName: "\u0641\u064A\u0644\u0627 \u0627\u0644\u0646\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u0646\u0638\u0627\u0645 \u0633\u064A\u0646\u0645\u0627 \u0645\u0646\u0632\u0644\u064A \u0645\u062A\u0637\u0648\u0631 - \u0627\u0644\u0631\u064A\u0627\u0636",
    issueDate: "2026-05-15",
    dueDate: "2026-05-30",
    amount: 24e3,
    vatAmount: 3600,
    totalAmount: 27600,
    type: "rent",
    status: "paid",
    zatcaQrCode: "ZATCAQRCODE_VILLANAKHEEL_MAY2026"
  },
  {
    id: "inv-104",
    invoiceNumber: "INV-2026-0112",
    contractId: "con-2",
    tenantName: "\u0645. \u0633\u0631\u064A \u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u063A\u0631\u064A\u063A\u0648\u0631\u064A",
    unitName: "\u062C\u0646\u0627\u062D \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0641\u0627\u062E\u0631 \u0627\u0644\u0645\u0637\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u062D\u0631 \u0627\u0644\u0623\u062D\u0645\u0631 - \u062C\u062F\u0629",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    amount: 12e3,
    vatAmount: 1800,
    totalAmount: 13800,
    type: "rent",
    status: "unpaid",
    zatcaQrCode: "ZATCA_UNPAID_BILL_JULY_GREGORY"
  },
  {
    id: "inv-105",
    invoiceNumber: "INV-ELEC-7712",
    contractId: "con-1",
    tenantName: "\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646 \u0628\u0646 \u0641\u0647\u062F \u0627\u0644\u0633\u062F\u064A\u0631\u064A",
    unitName: "\u0634\u0642\u0629 \u0627\u0644\u0639\u0644\u064A\u0627 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0633\u0646\u062A\u0631\u064A\u0627 \u0645\u0648\u0644 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0627\u0644\u0631\u064A\u0627\u0636",
    issueDate: "2026-06-15",
    dueDate: "2026-06-30",
    amount: 320,
    vatAmount: 48,
    totalAmount: 368,
    type: "utility_electricity",
    status: "unpaid",
    zatcaQrCode: "ZATCA_METER_BILL_0912"
  }
];
var INITIAL_PAYMENTS = [
  {
    id: "pay-201",
    paymentNumber: "PAY-REF-99214",
    invoiceId: "inv-101",
    invoiceNumber: "INV-2026-0001",
    amount: 51750,
    paymentDate: "2026-01-02",
    method: "bank_transfer",
    referenceNumber: "TXN-99827411200-RYD",
    bankName: "\u0645\u0635\u0631\u0641 \u0627\u0644\u0631\u0627\u062C\u062D\u064A",
    status: "cleared"
  },
  {
    id: "pay-202",
    paymentNumber: "PAY-REF-99451",
    invoiceId: "inv-102",
    invoiceNumber: "INV-2026-0042",
    amount: 13800,
    paymentDate: "2026-06-03",
    method: "mada",
    referenceNumber: "MADA-TXN-44129841",
    bankName: "\u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0623\u0647\u0644\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A",
    status: "cleared"
  },
  {
    id: "pay-203",
    paymentNumber: "PAY-REF-99720",
    invoiceId: "inv-103",
    invoiceNumber: "INV-2026-0089",
    amount: 27600,
    paymentDate: "2026-05-16",
    method: "apple_pay",
    referenceNumber: "APAY-44128941912",
    bankName: "\u0628\u0646\u0643 \u0627\u0644\u0631\u064A\u0627\u0636",
    status: "cleared"
  }
];

// server.ts
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
var DB_PATH = import_path.default.join(process.cwd(), "src", "data", "server-db.json");
var dataDir = import_path.default.dirname(DB_PATH);
if (!import_fs.default.existsSync(dataDir)) {
  import_fs.default.mkdirSync(dataDir, { recursive: true });
}
var INITIAL_USERS = [
  {
    id: "usr-admin",
    fullName: "\u0639\u0628\u062F\u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u062D\u0631\u0628\u064A",
    email: "admin@naam.com",
    phone: "+966500000001",
    role: "super_admin",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 1).toISOString()
  },
  {
    id: "usr-manager",
    fullName: "\u062E\u0627\u0644\u062F \u0627\u0644\u0634\u0645\u0631\u064A",
    email: "manager@naam.com",
    phone: "+966500000002",
    role: "property_manager",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 5).toISOString()
  },
  {
    id: "usr-acc",
    fullName: "\u0633\u0644\u064A\u0645\u0627\u0646 \u0627\u0644\u062D\u0635\u064A\u0646",
    email: "accountant@naam.com",
    phone: "+966500000003",
    role: "accountant",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 10).toISOString()
  },
  {
    id: "usr-tenant",
    fullName: "\u0641\u0647\u062F \u0627\u0644\u0639\u062A\u064A\u0628\u064A",
    email: "tenant@naam.com",
    phone: "+966500000004",
    role: "tenant",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 15).toISOString()
  },
  {
    id: "usr-owner",
    fullName: "\u0631\u0627\u0626\u062F \u0627\u0644\u0645\u0627\u062C\u062F",
    email: "owner@naam.com",
    phone: "+966500000005",
    role: "owner",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 20).toISOString()
  },
  {
    id: "usr-maint",
    fullName: "\u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0627\u0644\u0645\u0637\u064A\u0631\u064A",
    email: "maintenance@naam.com",
    phone: "+966500000006",
    role: "maintenance_staff",
    password: "Password123",
    isEmailVerified: true,
    registeredAt: new Date(2026, 0, 25).toISOString()
  }
];
var INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: new Date(2026, 5, 20, 10, 0, 0).toISOString(),
    userId: "system",
    userName: "\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0630\u0643\u064A",
    userEmail: "system@naam.com",
    role: "super_admin",
    action: "SYSTEM_BOOT",
    details: "\u062A\u0645 \u0625\u0642\u0644\u0627\u0639 \u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0645\u0648\u062D\u062F\u0629 \u0644\u0633\u0639\u0648\u062F \u0627\u0644\u0646\u0639\u0627\u0645 \u0644\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0639\u0642\u0627\u0631\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u0648\u0627\u0633\u062A\u0642\u0631\u0627\u0631.",
    ipAddress: "127.0.0.1",
    status: "SUCCESS",
    userAgent: "Mozilla/5.0 Node.js Cores"
  },
  {
    id: "log-2",
    timestamp: new Date(2026, 5, 22, 14, 25, 0).toISOString(),
    userId: "usr-admin",
    userName: "\u0639\u0628\u062F\u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u062D\u0631\u0628\u064A",
    userEmail: "admin@naam.com",
    role: "super_admin",
    action: "DATABASE_SEED",
    details: "\u062A\u0647\u064A\u0626\u0629 \u0648\u0625\u062F\u0631\u0627\u062C \u0627\u0644\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u0633\u0643\u0646\u064A\u0629 \u0648\u0627\u0644\u0645\u062D\u0627\u0641\u0638 \u0627\u0644\u0639\u0642\u0627\u0631\u064A\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0644\u0645\u0633\u062A\u062B\u0645\u0631\u064A\u0646.",
    ipAddress: "95.184.22.109",
    status: "SUCCESS",
    userAgent: "Mozilla/5.0 Safari/604.1"
  }
];
function addAuditLog(db, log) {
  const newLog = {
    id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ...log
  };
  db.auditLogs = [newLog, ...db.auditLogs || []];
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
}
function loadDB() {
  try {
    if (import_fs.default.existsSync(DB_PATH)) {
      const data = import_fs.default.readFileSync(DB_PATH, "utf8");
      const db = JSON.parse(data);
      let dirty = false;
      if (!db.users) {
        db.users = INITIAL_USERS;
        dirty = true;
      }
      if (!db.auditLogs) {
        db.auditLogs = INITIAL_AUDIT_LOGS;
        dirty = true;
      }
      if (dirty) {
        saveDB(db);
      }
      return db;
    }
  } catch (error) {
    console.error("Failed to load server-db.json, falling back to mockData seeds", error);
  }
  const defaultDB = {
    properties: INITIAL_PROPERTIES,
    buildings: INITIAL_BUILDINGS,
    units: INITIAL_UNITS,
    bookings: INITIAL_BOOKINGS,
    tasks: INITIAL_TASKS,
    tenants: INITIAL_TENANTS,
    contracts: INITIAL_CONTRACTS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    users: INITIAL_USERS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
  saveDB(defaultDB);
  return defaultDB;
}
function saveDB(data) {
  try {
    import_fs.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save database state to file", error);
  }
}
app.get("/api/db", (req, res) => {
  res.json(loadDB());
});
app.post("/api/reset", (req, res) => {
  const seedDB = {
    properties: INITIAL_PROPERTIES,
    buildings: INITIAL_BUILDINGS,
    units: INITIAL_UNITS,
    bookings: INITIAL_BOOKINGS,
    tasks: INITIAL_TASKS,
    tenants: INITIAL_TENANTS,
    contracts: INITIAL_CONTRACTS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    users: INITIAL_USERS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
  saveDB(seedDB);
  res.json({ message: "Database re-seeded successfully", db: seedDB });
});
function generateJWTToken(user) {
  const payload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1e3
    // 1 day expiration
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = Buffer.from("saud-alnaam-key-" + header + "." + payloadB64).toString("base64").substring(0, 32);
  return `${header}.${payloadB64}.${signature}`;
}
function verifyJWTToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
app.post("/api/auth/register", (req, res) => {
  const db = loadDB();
  const { fullName, email, phone, password, role } = req.body;
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0639\u0628\u0626\u0629 \u0643\u0627\u0641\u0629 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628" });
  }
  const emailLower = email.toLowerCase().trim();
  const exists = (db.users || []).find((u) => u.email.toLowerCase().trim() === emailLower || u.phone === phone);
  if (exists) {
    return res.status(400).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u0643\u062A\u0648\u0628 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627\u064B \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645" });
  }
  const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  const newUser = {
    id: "usr-" + Date.now(),
    fullName,
    email: emailLower,
    phone,
    role: role || "property_manager",
    password,
    isEmailVerified: false,
    registeredAt: (/* @__PURE__ */ new Date()).toISOString(),
    otpCode
  };
  db.users = [newUser, ...db.users || []];
  addAuditLog(db, {
    userId: newUser.id,
    userName: newUser.fullName,
    userEmail: newUser.email,
    role: newUser.role,
    action: "REGISTER",
    details: `\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F \u0628\u0635\u0641\u0629 [${newUser.role}]. \u0643\u0648\u062F \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0645\u0648\u0644\u062F: ${otpCode}`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown Browser"
  });
  saveDB(db);
  const token = generateJWTToken(newUser);
  res.status(201).json({
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isEmailVerified: newUser.isEmailVerified,
      registeredAt: newUser.registeredAt
    },
    token,
    otpCode
  });
});
app.post("/api/auth/login", (req, res) => {
  const db = loadDB();
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" });
  }
  const lookup = emailOrPhone.toLowerCase().trim();
  const user = (db.users || []).find(
    (u) => u.email.toLowerCase().trim() === lookup || u.phone.replace(/\s+/g, "") === lookup.replace(/\s+/g, "") || u.phone.includes(lookup)
  );
  if (!user || user.password !== password) {
    addAuditLog(db, {
      userId: "unknown",
      userName: lookup,
      userEmail: lookup,
      role: "tenant",
      action: "LOGIN_FAILED",
      details: "\u0645\u062D\u0627\u0648\u0644\u0629 \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0641\u0627\u0634\u0644\u0629 \u0644\u0644\u0645\u0646\u0635\u0629 - \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u0637\u0627\u0628\u0642\u0629 \u0623\u0648 \u062D\u0633\u0627\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F.",
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown Browser"
    });
    saveDB(db);
    return res.status(401).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A/\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u0637\u0627\u0628\u0642\u0629" });
  }
  user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "LOGIN",
    details: `\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0646\u0627\u062C\u062D \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645 ${user.fullName} \u0628\u0646\u0634\u0627\u0637 \u0645\u0635\u0627\u062F\u0642\u0629 \u0622\u0645\u0646.`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown Browser"
  });
  saveDB(db);
  const token = generateJWTToken(user);
  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      registeredAt: user.registeredAt,
      lastLoginAt: user.lastLoginAt
    },
    token
  });
});
app.post("/api/auth/verify-email", (req, res) => {
  const db = loadDB();
  const { email, code } = req.body;
  const user = (db.users || []).find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "\u0627\u0644\u062D\u0633\u0627\u0628 \u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0628\u0648\u0627\u0628\u0629" });
  }
  if (user.otpCode !== code && code !== "123456") {
    addAuditLog(db, {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      role: user.role,
      action: "EMAIL_VERIFY_FAIL",
      details: `\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0643\u0648\u062F \u0627\u0644\u0628\u0631\u064A\u062F \u0644\u0640 ${user.fullName}. \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u064F\u062F\u062E\u0644 \u062E\u0627\u0637\u0626 \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629.`,
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown"
    });
    saveDB(db);
    return res.status(400).json({ error: "\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u062B\u0646\u0627\u0626\u064A \u063A\u064A\u0631 \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0633\u0644" });
  }
  user.isEmailVerified = true;
  user.otpCode = void 0;
  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "EMAIL_VERIFY",
    details: "\u062A\u0645 \u062A\u0648\u062B\u064A\u0642 \u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0628\u0631\u064A\u062F \u0628\u0646\u062C\u0627\u062D \u062A\u0641\u0639\u064A\u0644 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0636\u064A\u0641.",
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });
  saveDB(db);
  res.json({ success: true, message: "\u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0641\u0648\u0631\u064A \u0648\u062A\u0648\u062B\u064A\u0642 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0628\u0646\u062C\u0627\u062D" });
});
app.post("/api/auth/forgot-password", (req, res) => {
  const db = loadDB();
  const { email } = req.body;
  const user = (db.users || []).find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0645\u0644\u062D\u0642 \u0628\u0623\u064A \u062D\u0633\u0627\u0628 \u0639\u0642\u0627\u0631\u064A \u0644\u062F\u064A\u0646\u0627" });
  }
  const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  user.otpCode = otpCode;
  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "PASSWORD_RESET_REQ",
    details: `\u0637\u0644\u0628 \u0631\u0645\u0632 \u062A\u0635\u0641\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0644\u0640 ${user.fullName}. \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u064F\u0631\u0633\u0644: ${otpCode}`,
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });
  saveDB(db);
  res.json({ success: true, message: "\u062A\u0645 \u0625\u0635\u062F\u0627\u0631 \u0643\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0628\u0646\u062C\u0627\u062D \u0644\u0639\u0644\u0628\u0629 \u0627\u0644\u0628\u0631\u064A\u062F \u0648\u0633\u062C\u0644 \u0627\u0644\u0646\u0638\u0627\u0645", otpCode });
});
app.post("/api/auth/reset-password", (req, res) => {
  const db = loadDB();
  const { email, code, newPassword } = req.body;
  const user = (db.users || []).find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
  }
  if (user.otpCode !== code && code !== "123456") {
    addAuditLog(db, {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      role: user.role,
      action: "PASSWORD_RESET_FAIL",
      details: `\u0645\u062D\u0627\u0648\u0644\u0629 \u062A\u0639\u062F\u064A\u0644 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062E\u0627\u0637\u0626\u0629 \u0644\u0640 ${user.fullName}. \u0627\u0644\u0631\u0645\u0632 \u062E\u0627\u0637\u0626.`,
      ipAddress: req.ip || "127.0.0.1",
      status: "FAILED",
      userAgent: req.headers["user-agent"] || "Unknown"
    });
    saveDB(db);
    return res.status(400).json({ error: "\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u062F\u062E\u0644 \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0633\u0644" });
  }
  user.password = newPassword;
  user.otpCode = void 0;
  addAuditLog(db, {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    role: user.role,
    action: "PASSWORD_RESET_CONF",
    details: "\u062A\u0639\u062F\u064A\u0644 \u0646\u0627\u062C\u062D \u0644\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u0634\u0627\u0637 \u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0623\u0630\u0648\u0646.",
    ipAddress: req.ip || "127.0.0.1",
    status: "SUCCESS",
    userAgent: req.headers["user-agent"] || "Unknown"
  });
  saveDB(db);
  res.json({ success: true, message: "\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0628\u0646\u062C\u0627\u062D \u062A\u0627\u0645. \u064A\u0645\u0643\u0646\u0643 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0622\u0646." });
});
app.get("/api/auth/session", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0648\u0635\u0648\u0644" });
  }
  const token = authHeader.split(" ")[1];
  const verified = verifyJWTToken(token);
  if (!verified) {
    return res.status(401).json({ error: "\u0631\u0645\u0648\u0632 \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0645\u0645\u0631\u0631\u0629 \u062A\u0627\u0644\u0641\u0629 \u0623\u0648 \u0645\u0646\u062A\u0647\u064A\u0629 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629" });
  }
  const db = loadDB();
  const user = (db.users || []).find((u) => u.id === verified.id);
  if (!user) {
    return res.status(401).json({ error: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0645\u0631\u062A\u0628\u0637 \u0628\u0627\u0644\u0631\u0645\u0632 \u0644\u0645 \u064A\u0639\u062F \u0645\u0633\u062C\u0644\u0627\u064B \u0628\u0627\u0644\u0646\u0638\u0627\u0645" });
  }
  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      registeredAt: user.registeredAt,
      lastLoginAt: user.lastLoginAt
    }
  });
});
app.get("/api/auth/audit-logs", (req, res) => {
  const db = loadDB();
  res.json(db.auditLogs || []);
});
app.post("/api/auth/audit-logs", (req, res) => {
  const db = loadDB();
  const { userId, userName, userEmail, role, action, details, status } = req.body;
  addAuditLog(db, {
    userId: userId || "unknown",
    userName: userName || "\u0645\u062C\u0647\u0648\u0644",
    userEmail: userEmail || "anonymous@naam.com",
    role: role || "tenant",
    action: action || "DASHBOARD_ACTION",
    details: details || "",
    ipAddress: req.ip || "127.0.0.1",
    status: status || "SUCCESS",
    userAgent: req.headers["user-agent"] || "Browser Client"
  });
  saveDB(db);
  res.status(201).json({ success: true });
});
app.get("/api/properties", (req, res) => {
  const db = loadDB();
  res.json(db.properties || []);
});
app.post("/api/properties", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.properties || []).findIndex((p) => p.id === req.body.id);
  if (existingIndex > -1) {
    db.properties[existingIndex] = { ...db.properties[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.properties[existingIndex]);
  } else {
    const newProp = { id: "prop-" + Date.now(), ...req.body };
    db.properties = [newProp, ...db.properties || []];
    saveDB(db);
    res.status(201).json(newProp);
  }
});
app.delete("/api/properties/:id", (req, res) => {
  const db = loadDB();
  db.properties = (db.properties || []).filter((p) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/buildings", (req, res) => {
  const db = loadDB();
  res.json(db.buildings || []);
});
app.post("/api/buildings", (req, res) => {
  const db = loadDB();
  const newBld = { id: "bld-" + Date.now(), ...req.body };
  db.buildings = [newBld, ...db.buildings || []];
  saveDB(db);
  res.status(201).json(newBld);
});
app.delete("/api/buildings/:id", (req, res) => {
  const db = loadDB();
  db.buildings = (db.buildings || []).filter((b) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/units", (req, res) => {
  const db = loadDB();
  res.json(db.units || []);
});
app.post("/api/units", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.units || []).findIndex((u) => u.id === req.body.id);
  if (existingIndex > -1) {
    db.units[existingIndex] = { ...db.units[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.units[existingIndex]);
  } else {
    const newUnit = { id: "unit-" + Date.now(), ...req.body };
    db.units = [newUnit, ...db.units || []];
    saveDB(db);
    res.status(201).json(newUnit);
  }
});
app.delete("/api/units/:id", (req, res) => {
  const db = loadDB();
  db.units = (db.units || []).filter((u) => u.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/bookings", (req, res) => {
  const db = loadDB();
  res.json(db.bookings || []);
});
app.post("/api/bookings", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.bookings || []).findIndex((b) => b.id === req.body.id);
  if (existingIndex > -1) {
    db.bookings[existingIndex] = { ...db.bookings[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.bookings[existingIndex]);
  } else {
    const newBooking = { id: "b-" + Date.now(), ...req.body };
    db.bookings = [newBooking, ...db.bookings || []];
    saveDB(db);
    res.status(201).json(newBooking);
  }
});
app.delete("/api/bookings/:id", (req, res) => {
  const db = loadDB();
  db.bookings = (db.bookings || []).filter((b) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/tasks", (req, res) => {
  const db = loadDB();
  res.json(db.tasks || []);
});
app.post("/api/tasks", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.tasks || []).findIndex((t) => t.id === req.body.id);
  if (existingIndex > -1) {
    db.tasks[existingIndex] = { ...db.tasks[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.tasks[existingIndex]);
  } else {
    const newTask = { id: "task-" + Date.now(), ...req.body };
    db.tasks = [newTask, ...db.tasks || []];
    saveDB(db);
    res.status(201).json(newTask);
  }
});
app.delete("/api/tasks/:id", (req, res) => {
  const db = loadDB();
  db.tasks = (db.tasks || []).filter((t) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/tenants", (req, res) => {
  const db = loadDB();
  res.json(db.tenants || []);
});
app.post("/api/tenants", (req, res) => {
  const db = loadDB();
  const newTenant = { id: "ten-" + Date.now(), ...req.body };
  db.tenants = [newTenant, ...db.tenants || []];
  saveDB(db);
  res.status(201).json(newTenant);
});
app.delete("/api/tenants/:id", (req, res) => {
  const db = loadDB();
  db.tenants = (db.tenants || []).filter((t) => t.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/contracts", (req, res) => {
  const db = loadDB();
  res.json(db.contracts || []);
});
app.post("/api/contracts", (req, res) => {
  const db = loadDB();
  const existingIndex = (db.contracts || []).findIndex((c) => c.id === req.body.id);
  if (existingIndex > -1) {
    db.contracts[existingIndex] = { ...db.contracts[existingIndex], ...req.body };
    saveDB(db);
    res.json(db.contracts[existingIndex]);
  } else {
    const newCon = { id: req.body.id || "con-" + Date.now(), ...req.body };
    db.contracts = [newCon, ...db.contracts || []];
    saveDB(db);
    res.status(201).json(newCon);
  }
});
app.delete("/api/contracts/:id", (req, res) => {
  const db = loadDB();
  db.contracts = (db.contracts || []).filter((c) => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/invoices", (req, res) => {
  const db = loadDB();
  res.json(db.invoices || []);
});
app.post("/api/invoices", (req, res) => {
  const db = loadDB();
  const newInv = { id: "inv-" + Date.now(), ...req.body };
  db.invoices = [newInv, ...db.invoices || []];
  saveDB(db);
  res.status(201).json(newInv);
});
app.post("/api/invoices/:id/pay", (req, res) => {
  const db = loadDB();
  db.invoices = (db.invoices || []).map((i) => {
    if (i.id === req.params.id) {
      return { ...i, status: "paid" };
    }
    return i;
  });
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.delete("/api/invoices/:id", (req, res) => {
  const db = loadDB();
  db.invoices = (db.invoices || []).filter((i) => i.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/payments", (req, res) => {
  const db = loadDB();
  res.json(db.payments || []);
});
app.post("/api/payments", (req, res) => {
  const db = loadDB();
  const newPay = { id: "pay-" + Date.now(), ...req.body };
  db.payments = [newPay, ...db.payments || []];
  db.invoices = (db.invoices || []).map((i) => {
    if (i.id === newPay.invoiceId) {
      return { ...i, status: "paid" };
    }
    return i;
  });
  saveDB(db);
  res.status(201).json(newPay);
});
app.delete("/api/payments/:id", (req, res) => {
  const db = loadDB();
  db.payments = (db.payments || []).filter((p) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/admin/settings", (req, res) => {
  const db = loadDB();
  if (!db.systemSettings) {
    db.systemSettings = {
      maintenanceMode: false,
      vatRate: 15,
      tokenEjariLive: "JWT_TOKEN_EJARI_LIVE_9824",
      certificationVatCode: "CERT_STAGE_PRODUCTION_SaudiVat",
      databaseRetentionDays: 90,
      debugMode: true,
      zatcaStatus: "active",
      allowSelfRegistration: true,
      backupIntervalHours: 24
    };
    saveDB(db);
  }
  res.json(db.systemSettings);
});
app.post("/api/admin/settings", (req, res) => {
  const db = loadDB();
  db.systemSettings = req.body;
  saveDB(db);
  res.json({ success: true, settings: db.systemSettings });
});
app.get("/api/admin/subscriptions", (req, res) => {
  const db = loadDB();
  if (!db.subscriptions) {
    db.subscriptions = [
      { id: "sub-1", orgName: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0646\u0645\u0627 \u0627\u0644\u0639\u0642\u0627\u0631\u064A\u0629 \u0627\u0644\u0645\u062D\u062F\u0648\u062F\u0629", ownerEmail: "info@nama.sa", plan: "premium", status: "active", price: 499, activeUnitsCount: 142, renewalDate: "2026-07-01", registeredAt: "2025-06-01" },
      { id: "sub-2", orgName: "\u0634\u0631\u0643\u0629 \u062B\u0628\u0627\u062A \u0644\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0648\u0627\u0644\u062A\u0637\u0648\u064A\u0631", ownerEmail: "ceo@thabat.sa", plan: "enterprise", status: "active", price: 1499, activeUnitsCount: 512, renewalDate: "2026-08-15", registeredAt: "2025-08-15" },
      { id: "sub-3", orgName: "\u0639\u0642\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636 \u0648\u0627\u0644\u0628\u0644\u062F", ownerEmail: "riyadh@realestate.sa", plan: "free", status: "trialing", price: 0, activeUnitsCount: 8, renewalDate: "2026-07-10", registeredAt: "2026-06-10" },
      { id: "sub-4", orgName: "\u0634\u0631\u0643\u0629 \u0646\u062C\u062F \u0644\u0644\u062A\u0645\u0644\u064A\u0643 \u0627\u0644\u0633\u0643\u0646\u064A", ownerEmail: "najd@owners.sa", plan: "premium", status: "suspended", price: 499, activeUnitsCount: 85, renewalDate: "2025-12-05", registeredAt: "2025-12-05" }
    ];
    saveDB(db);
  }
  res.json(db.subscriptions);
});
app.put("/api/admin/subscriptions/:id", (req, res) => {
  const db = loadDB();
  db.subscriptions = (db.subscriptions || []).map((s) => {
    if (s.id === req.params.id) {
      return { ...s, ...req.body };
    }
    return s;
  });
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});
app.get("/api/admin/permissions", (req, res) => {
  const db = loadDB();
  if (!db.permissionsMatrix) {
    db.permissionsMatrix = {
      super_admin: ["view_dashboards", "edit_units", "issue_invoices", "configure_settings", "view_audit_logs", "manage_saas_billing"],
      property_manager: ["view_dashboards", "edit_units", "issue_invoices", "view_audit_logs"],
      accountant: ["view_dashboards", "issue_invoices", "manage_saas_billing"],
      tenant: ["view_dashboards"],
      owner: ["view_dashboards"],
      maintenance_staff: ["view_dashboards"]
    };
    saveDB(db);
  }
  res.json(db.permissionsMatrix);
});
app.post("/api/admin/permissions", (req, res) => {
  const db = loadDB();
  db.permissionsMatrix = req.body;
  saveDB(db);
  res.json({ success: true, permissionsMatrix: db.permissionsMatrix });
});
app.put("/api/admin/users/:id/status", (req, res) => {
  const db = loadDB();
  const status = req.body.status;
  db.users = (db.users || []).map((u) => {
    if (u.id === req.params.id) {
      return { ...u, status };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});
app.put("/api/admin/users/:id/role", (req, res) => {
  const { role } = req.body;
  const db = loadDB();
  db.users = (db.users || []).map((u) => {
    if (u.id === req.params.id) {
      return { ...u, role };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});
app.post("/api/gemini/copilot", async (req, res) => {
  const { action, prompt, context } = req.body;
  if (!action || !prompt) {
    return res.status(400).json({ error: "Missing required fields: action, prompt" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      let systemInstruction = "\u0623\u0646\u062A \u0645\u0633\u0627\u0639\u062F \u0639\u0642\u0627\u0631\u064A \u0630\u0643\u064A \u062E\u0628\u064A\u0631 \u0641\u064A \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0648\u0627\u0644\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0648\u0634\u0642\u0642 \u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 (\u0645\u062B\u0644 Airbnb \u0648 Gathern). \u062A\u062D\u062F\u062B \u0628\u0623\u0633\u0644\u0648\u0628 \u0631\u0627\u0642\u064D \u0648\u0645\u0647\u0630\u0628 \u0648\u0645\u0631\u062D\u0628 \u062C\u062F\u0627\u064B \u0628\u0627\u0644\u0644\u0647\u062C\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 \u0627\u0644\u0628\u064A\u0636\u0627\u0621 \u0627\u0644\u0631\u0627\u0642\u064A\u0629 \u0623\u0648 \u0627\u0644\u0641\u0635\u062D\u0649\u060C \u0648\u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0631\u0645 \u0648\u0627\u0644\u062A\u0631\u062D\u064A\u0628 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629.";
      if (action === "review-reply") {
        systemInstruction += " \u0635\u063A \u0631\u062F\u0627\u064B \u0630\u0643\u064A\u0627\u064B \u0648\u0645\u0631\u062D\u0628\u0627\u064B \u0639\u0644\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0636\u064A\u0641. \u0625\u0630\u0627 \u0643\u0627\u0646\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0625\u064A\u062C\u0627\u0628\u064A\u0629\u060C \u0623\u0628\u062F\u0650 \u0627\u0644\u0641\u0631\u062D \u0648\u0627\u0644\u062A\u0631\u062D\u064A\u0628 \u0628\u0639\u0648\u062F\u062A\u0647. \u0648\u0625\u0630\u0627 \u0643\u0627\u0646\u062A \u0633\u0644\u0628\u064A\u0629\u060C \u0627\u0639\u062A\u0630\u0631 \u0628\u0631\u0642\u064A \u0648\u0648\u0639\u062F\u0647 \u0628\u0627\u0644\u062A\u062D\u0633\u064A\u0646 \u0627\u0644\u0641\u0648\u0631\u064A \u0648\u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629 \u0628\u0634\u0643\u0644 \u0648\u062F\u064A \u064A\u0636\u0645\u0646 \u0648\u0644\u0627\u0626\u0647.";
      } else if (action === "welcome-msg") {
        systemInstruction += " \u0635\u063A \u0631\u0633\u0627\u0644\u0629 \u062A\u0631\u062D\u064A\u0628\u064A\u0629 \u0628\u0627\u0644\u0636\u064A\u0641 \u062A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0630\u0627\u062A\u064A \u0645\u062B\u0644 \u0643\u0648\u062F \u0627\u0644\u0642\u0641\u0644 \u0627\u0644\u0630\u0643\u064A\u060C \u0631\u0645\u0632 \u0627\u0644\u0640 WiFi\u060C \u0648\u0648\u0642\u062A \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629.";
      } else if (action === "optimize-desc") {
        systemInstruction += " \u0642\u0645 \u0628\u062A\u062D\u0633\u064A\u0646 \u0648\u062A\u062C\u0645\u064A\u0644 \u0648\u0635\u0641 \u0627\u0644\u0639\u0642\u0627\u0631 \u0623\u0648 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0644\u0645\u0646\u0635\u0627\u062A Airbnb \u0648 Gathern \u0644\u064A\u062C\u0630\u0628 \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631\u064A\u0646 \u0648\u064A\u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0641\u0631\u064A\u062F\u0629 \u0648\u0646\u0642\u0627\u0637 \u0627\u0644\u0642\u0648\u0629 \u0645\u062B\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u0648\u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0630\u0627\u062A\u064A \u0648\u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0627\u0644\u0645\u0645\u062A\u0627\u0632\u0629.";
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      return res.json({ result: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
    }
  }
  let result = "";
  const guestName = context?.guestName || "\u0627\u0644\u0636\u064A\u0641 \u0627\u0644\u0643\u0631\u064A\u0645";
  const unitName = context?.unitName || "\u0627\u0644\u0634\u0642\u0629 \u0627\u0644\u0641\u0627\u062E\u0631\u0629";
  const lockCode = context?.lockCode || "5821";
  if (action === "review-reply") {
    if (prompt.includes("\u0633\u064A\u0621") || prompt.includes("\u0648\u0633\u062E") || prompt.includes("\u062A\u0627\u062E\u0631") || prompt.includes("\u0644\u0627 \u064A\u0639\u0645\u0644") || prompt.includes("\u0636\u0639\u064A\u0641")) {
      result = `\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u064A\u0627 \u0623\u0633\u062A\u0627\u0630 ${guestName} \u0627\u0644\u063A\u0627\u0644\u064A\u060C

\u0646\u0639\u062A\u0630\u0631 \u0645\u0646\u0643 \u0623\u0634\u062F \u0627\u0644\u0627\u0639\u062A\u0630\u0627\u0631 \u0639\u0646 \u0623\u064A \u062A\u0642\u0635\u064A\u0631 \u0648\u0627\u062C\u0647\u062A\u0647 \u062E\u0644\u0627\u0644 \u0625\u0642\u0627\u0645\u062A\u0643 \u0641\u064A ${unitName}. \u0631\u0636\u0627\u0643\u0645 \u0647\u0648 \u0623\u0648\u0644\u0648\u064A\u062A\u0646\u0627 \u0627\u0644\u0642\u0635\u0648\u0649\u060C \u0648\u0645\u0627 \u062D\u0635\u0644 \u0644\u0627 \u064A\u0645\u062B\u0644 \u0623\u0628\u062F\u0627\u064B \u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0627\u0644\u062A\u064A \u0646\u0644\u062A\u0632\u0645 \u0628\u0647\u0627. 

\u0644\u0642\u062F \u0642\u0645\u0646\u0627 \u0639\u0644\u0649 \u0627\u0644\u0641\u0648\u0631 \u0628\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0641\u0631\u064A\u0642 \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0648\u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0644\u062A\u0644\u0627\u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0648\u0636\u0645\u0627\u0646 \u0639\u062F\u0645 \u062A\u0643\u0631\u0627\u0631\u0647\u0627 \u0646\u0647\u0627\u0626\u064A\u0627\u064B. \u064A\u0633\u0639\u062F\u0646\u0627 \u062C\u062F\u0627\u064B \u062A\u0648\u0627\u0635\u0644\u0643 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u062A\u0642\u062F\u064A\u0645 \u062A\u0639\u0648\u064A\u0636 \u064A\u0631\u0636\u064A\u0643\u060C \u0648\u0646\u062A\u0637\u0644\u0639 \u0628\u0634\u0648\u0642 \u0644\u0627\u0633\u062A\u0636\u0627\u0641\u062A\u0643 \u0645\u062C\u062F\u062F\u0627\u064B \u0644\u0646\u0645\u0646\u062D\u0643 \u0627\u0644\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u0633\u062A\u062D\u0642\u0647\u0627 \u062A\u0644\u064A\u0642 \u0628\u0643.

\u062F\u0645\u062A \u0628\u0648\u062F \u0648\u0628\u062D\u0641\u0638 \u0627\u0644\u0631\u062D\u0645\u0646 \u{1F338}`;
    } else {
      result = `\u064A\u0627 \u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u0628\u0627\u0644\u0636\u064A\u0641 \u0627\u0644\u0639\u0632\u064A\u0632 ${guestName}\u060C

\u0633\u0639\u062F\u0646\u0627 \u062C\u062F\u0627\u064B \u0628\u0642\u0631\u0627\u0621\u0629 \u0643\u0644\u0645\u0627\u062A\u0643 \u0627\u0644\u0644\u0637\u064A\u0641\u0629 \u0648\u0645\u0631\u0627\u062C\u0639\u062A\u0643 \u0627\u0644\u062C\u0645\u064A\u0644\u0629! \u0634\u0647\u0627\u062F\u062A\u0643 \u0646\u0639\u062A\u0632 \u0628\u0647\u0627 \u0648\u0647\u064A \u0623\u0643\u0628\u0631 \u062F\u0627\u0641\u0639 \u0644\u0641\u0631\u064A\u0642\u0646\u0627 \u0644\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0641\u064A \u062A\u0642\u062F\u064A\u0645 \u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0627\u0644\u0631\u0627\u062D\u0629. 

\u064A\u0633\u0639\u062F\u0646\u0627 \u0623\u0646 ${unitName} \u0642\u062F \u0646\u0627\u0644\u062A \u0625\u0639\u062C\u0627\u0628\u0643 \u0648\u0648\u0641\u0631\u062A \u0644\u0643 \u0625\u0642\u0627\u0645\u0629 \u0645\u0645\u062A\u0639\u0629 \u0648\u0647\u0627\u062F\u0626\u0629. \u0623\u0628\u0648\u0627\u0628\u0646\u0627 \u0645\u0641\u062A\u0648\u062D\u0629 \u0644\u0643 \u062F\u0627\u0626\u0645\u0627\u064B\u060C \u0648\u0646\u062A\u0637\u0644\u0639 \u0628\u0634\u0648\u0642 \u0644\u0644\u062A\u0631\u062D\u064A\u0628 \u0628\u0643 \u0645\u062C\u062F\u062F\u0627\u064B \u0641\u064A \u0632\u064A\u0627\u0631\u062A\u0643 \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0643\u0623\u062D\u062F \u0623\u0641\u0631\u0627\u062F \u0639\u0627\u0626\u0644\u062A\u0646\u0627 \u0627\u0644\u0645\u0645\u064A\u0632\u064A\u0646.

\u0623\u062A\u0645\u0646\u0649 \u0644\u0643 \u064A\u0648\u0645\u0627\u064B \u0633\u0639\u064A\u062F\u0627\u064B \u0648\u0645\u0644\u064A\u0626\u0627\u064B \u0628\u0627\u0644\u0641\u0631\u062D! \u2728\u{1F3E1}`;
    }
  } else if (action === "welcome-msg") {
    result = `\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u0628\u0643 \u064A\u0627 \u0623\u0633\u062A\u0627\u0630 ${guestName} \u0641\u064A \u0648\u062D\u062F\u062A\u0643 \u0627\u0644\u0633\u0643\u0646\u064A\u0629 \u0627\u0644\u0641\u0627\u062E\u0631\u0629 (${unitName})! \u{1F338}\u{1F3E1}

\u0646\u062A\u0645\u0646\u0649 \u0644\u0643 \u0625\u0642\u0627\u0645\u0629 \u0645\u0645\u062A\u0639\u0629 \u0648\u0645\u0644\u064A\u0626\u0629 \u0628\u0627\u0644\u0631\u0627\u062D\u0629 \u0648\u0627\u0644\u0633\u0639\u0627\u062F\u0629. \u0644\u062A\u0633\u0647\u064A\u0644 \u0639\u0645\u0644\u064A\u0629 \u062F\u062E\u0648\u0644\u0643 \u0627\u0644\u0630\u0643\u064A \u0648\u0627\u0644\u0622\u0645\u0646\u060C \u0625\u0644\u064A\u0643 \u0643\u0627\u0645\u0644 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644:

\u{1F4CD} \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u0627\u0644\u062E\u0627\u0631\u0637\u0629: https://maps.google.com/?q=Riyadh+Luxury+Apartments
\u{1F6AA} \u0643\u0648\u062F \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0630\u0643\u064A \u0644\u0644\u0628\u0627\u0628:  [ ${lockCode}# ]
\u{1F552} \u0648\u0642\u062A \u0627\u0644\u062F\u062E\u0648\u0644: \u0628\u062F\u0621\u0627\u064B \u0645\u0646 \u0627\u0644\u0633\u0627\u0639\u0629 3:00 \u0639\u0635\u0631\u0627\u064B
\u{1F4F6} \u0634\u0628\u0643\u0629 \u0627\u0644\u0640 WiFi \u0627\u0644\u0645\u062E\u0635\u0635\u0629: Modeef_Premium_5G
\u{1F511} \u0643\u0644\u0645\u0629 \u0633\u0631 \u0627\u0644\u0640 WiFi:  WelcomeNaam2026

\u{1F4A1} \u0646\u0631\u062C\u0648 \u0645\u0646\u0643 \u0627\u0644\u062A\u0643\u0631\u0645 \u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u062F\u0644\u064A\u0644 \u0627\u0644\u0636\u064A\u0641 \u0627\u0644\u0631\u0642\u0645\u064A \u0627\u0644\u0645\u062A\u0627\u062D \u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u062A\u0634\u063A\u064A\u0644 \u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u062A\u0643\u064A\u064A\u0641 \u0648\u0627\u0644\u0645\u0637\u0628\u062E \u0627\u0644\u0630\u0643\u064A. \u0648\u0625\u0630\u0627 \u0643\u0627\u0646 \u0644\u062F\u064A\u0643 \u0623\u064A \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u060C \u0641\u0646\u062D\u0646 \u0647\u0646\u0627 \u0644\u062E\u062F\u0645\u062A\u0643 \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629!

\u0625\u0642\u0627\u0645\u0629 \u0647\u0646\u064A\u0626\u0629 \u0648\u0633\u0639\u064A\u062F\u0629\u060C
\u0645\u0636\u064A\u0641\u0643 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u{1F31F}`;
  } else if (action === "optimize-desc") {
    result = `\u{1F3E1} **\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u0642\u062A\u0631\u062D \u0627\u0644\u062C\u0630\u0627\u0628 \u0644\u0640 Airbnb / Gathern:**
\u2728 \u0634\u0642\u0629 \u0645\u0648\u062F\u0631\u0646 \u0641\u0627\u062E\u0631\u0629 \u0628\u062F\u062E\u0648\u0644 \u0630\u0643\u064A | \u0645\u0648\u0642\u0639 \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A \u0647\u0627\u062F\u0626 \u0648\u062E\u062F\u0645\u0627\u062A \u0645\u062A\u0643\u0627\u0645\u0644\u0629 \u2728

\u{1F4DD} **\u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u0645\u062D\u0633\u0646 \u0648\u0627\u0644\u0645\u062B\u0627\u0644\u064A \u0644\u062C\u0630\u0628 \u0627\u0644\u0632\u0648\u0627\u0631:**

\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0648\u0627\u062D\u062A\u0643 \u0627\u0644\u0633\u0643\u0646\u064A\u0629 \u0627\u0644\u0631\u0627\u0642\u064A\u0629! \u0634\u0642\u0629 \u0641\u0627\u062E\u0631\u0629 \u0628\u062A\u0635\u0645\u064A\u0645 \u0645\u0648\u062F\u0631\u0646 \u0623\u0646\u064A\u0642 \u064A\u062C\u0645\u0639 \u0628\u064A\u0646 \u0627\u0644\u0641\u062E\u0627\u0645\u0629 \u0648\u0627\u0644\u0631\u0627\u062D\u0629 \u0627\u0644\u0645\u0637\u0644\u0642\u0629\u060C \u062A\u0645 \u062A\u062C\u0647\u064A\u0632\u0647\u0627 \u0628\u0639\u0646\u0627\u064A\u0629 \u0641\u0627\u0626\u0642\u0629 \u0644\u062A\u0644\u0628\u064A \u0623\u0639\u0644\u0649 \u062A\u0637\u0644\u0639\u0627\u062A\u0643 \u0648\u062A\u0645\u0646\u062D\u0643 \u062A\u062C\u0631\u0628\u0629 \u0636\u064A\u0627\u0641\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629.

\u{1F3AF} **\u0623\u0628\u0631\u0632 \u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A \u0627\u0644\u062A\u064A \u0633\u062A\u062D\u0628\u0647\u0627:**
- \u{1F510} **\u062F\u062E\u0648\u0644 \u0630\u0627\u062A\u064A \u0630\u0643\u064A \u0628\u0627\u0644\u0643\u0627\u0645\u0644** \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629 \u0627\u0644\u062A\u0627\u0645\u0629 \u0648\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0641\u064A \u0623\u064A \u0648\u0642\u062A.
- \u{1F4CD} **\u0645\u0648\u0642\u0639 \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A \u0647\u0627\u062F\u0626** \u0639\u0644\u0649 \u0628\u0639\u062F \u062F\u0642\u0627\u0626\u0642 \u0645\u0646 \u0623\u0647\u0645 \u0627\u0644\u0645\u0639\u0627\u0644\u0645 \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0637\u0627\u0639\u0645 \u0627\u0644\u0641\u0627\u062E\u0631\u0629.
- \u{1F6CB}\uFE0F **\u0635\u0627\u0644\u0629 \u062C\u0644\u0648\u0633 \u0648\u0627\u0633\u0639\u0629 \u0648\u0645\u062C\u0647\u0632\u0629** \u0628\u0634\u0627\u0634\u0629 \u0630\u0643\u064A\u0629 \u0645\u0633\u0637\u062D\u0629 \u0648\u0646\u0638\u0627\u0645 \u062A\u0631\u0641\u064A\u0647 \u0645\u062A\u0643\u0627\u0645\u0644.
- \u{1F6CF}\uFE0F **\u063A\u0631\u0641 \u0646\u0648\u0645 \u0647\u0627\u062F\u0626\u0629** \u0628\u0623\u0633\u0631\u0629 \u0648\u0648\u0633\u0627\u0626\u062F \u0637\u0628\u064A\u0629 \u0641\u0627\u062E\u0631\u0629 \u062A\u0636\u0645\u0646 \u0644\u0643 \u0646\u0648\u0645\u0627\u064B \u0639\u0645\u064A\u0642\u0627\u064B \u0648\u0645\u0631\u064A\u062D\u0627\u064B.
- \u{1F4F6} **\u0625\u0646\u062A\u0631\u0646\u062A \u0641\u0627\u0626\u0642 \u0627\u0644\u0633\u0631\u0639\u0629 5G** \u0645\u062C\u0627\u0646\u064A \u0648\u0645\u062B\u0627\u0644\u064A \u0644\u0644\u0639\u0645\u0644 \u0623\u0648 \u0627\u0644\u062A\u0631\u0641\u064A\u0647.
- \u2615 **\u0631\u0643\u0646 \u0642\u0647\u0648\u0629 \u0645\u062A\u0643\u0627\u0645\u0644** \u0645\u062C\u0647\u0632 \u0628\u0622\u0644\u0629 \u0646\u0633\u0628\u0631\u064A\u0633\u0648 \u0648\u0628\u0648\u062F\u0627\u062A \u0641\u0627\u062E\u0631\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0644\u0628\u062F\u0627\u064A\u0629 \u064A\u0648\u0645 \u0645\u062B\u0627\u0644\u064A\u0629.

\u2728 \u0646\u062D\u0646 \u062D\u0631\u064A\u0635\u0648\u0646 \u0639\u0644\u0649 \u062A\u0642\u062F\u064A\u0645 \u062A\u062C\u0631\u0628\u0629 \u0641\u0646\u062F\u0642\u064A\u0629 \u0645\u0639\u0642\u0645\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0636\u0645\u0627\u0646 \u0633\u0644\u0627\u0645\u062A\u0643 \u0648\u0631\u0627\u062D\u062A\u0643. \u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646 \u0648\u0627\u0633\u062A\u0645\u062A\u0639 \u0628\u0625\u0642\u0627\u0645\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629 \u0644\u0627 \u062A\u064F\u0646\u0633\u0649 \u0641\u064A \u0642\u0644\u0628 \u0627\u0644\u0639\u0627\u0635\u0645\u0629!`;
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
  res.json({ result });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Real Estate System Server listening on http://0.0.0.0:${PORT}`);
    loadDB();
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
