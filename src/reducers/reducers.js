const initialState = {
  screenState: "init-Dashboard",
  darkMode: false,
  theme: {
    primary: "#19535F",
    secondary: "#88B2B8",
    tertiary: "#A9BCD0",
    light: "#D8DBE2",
    lighter: "#fff",
    grey: "#393E41",
    dark: "#3c3f3c",
    darker: "#1B1B1E",
  },
  activeUser: {
    firstName: "",
    lastName: "",
    email: "",
    avatar: {},
    docId: "",
    friends: [],
  },
  userCookie: null,
  settingsExpanded: false,
  changePassword: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    success: "",
    showPassword: "false",
  },
  selectedTab: "",
  searchResults: [],
  userFriends: [],
  showAvatarEditor: false,
  activeListTab: 0,
  succeffListSave: false,
  userLists: [],
  editingListId: null,
  toastette: false,
  relativeListRole: null,
  datePickerDate: [],
  initListInfo: {
    listName: "",
    listDescription: "",
    listCreator: "",
    listUsers: [],
    listUserIds: [],
    listItems: [
      {
        id: 0,
        checked: false,
        value: "",
        quantity: "",
        units: "",
        image: "",
        dueDate: null,
        assignee: "",
        note: "",
      },
    ],
    listQuantity: false,
    listUnits: false,
    listImage: false,
    listDueDate: false,
    listAssignee: false,
    listNote: false,
  },
  initAvatarCustomizer: {
    hairColor: "BrownDark",
    topType: "LongHairStraight",
    mouthType: "Default",
    accessoriesType: "Blank",
    eyeType: "Default",
    graphicType: "Bat",
    clotheType: "BlazerShirt",
    facialHairType: "Blank",
    skinColor: "Light",
    facialHairColor: "Blank",
    hatColor: "BrownDark",
    eyebrowType: "Default",
    clotheColor: "Black",
  },
  listSaveError: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SCREEN_STATE":
      return {
        ...state,
        screenState: action.payload,
      };
    case "SET_DATE_PICKER_DATE":
      return {
        ...state,
        datePickerDate: action.payload,
      };
    case "SET_LIST_SAVE_ERROR":
      return {
        ...state,
        listSaveError: action.payload,
      };
    case "SET_ACTIVE_USER":
      return {
        ...state,
        activeUser: action.payload,
      };
    case "SET_USER_COOKIE":
      return {
        ...state,
        userCookie: action.payload,
      };
    case "SET_SETTINGS_EXPANDED":
      return {
        ...state,
        settingsExpanded: action.payload,
      };
    case "CHANGE_PASSWORD":
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          [action.payload.fieldName]: action.payload.value,
        },
      };
    case "SET_DARK_MODE":
      return {
        ...state,
        darkMode: action.payload,
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_SELECTED_TAB":
      return {
        ...state,
        selectedTab: action.payload,
      };
    case "SET_SHOW_AVATAR_EDITOR":
      return {
        ...state,
        showAvatarEditor: action.payload,
      };
    case "SET_USER_FRIENDS":
      return {
        ...state,
        userFriends: action.payload,
      };
    case "SET_INIT_AVATAR_CUSTOMIZER":
      return {
        ...state,
        initAvatarCustomizer: action.payload,
      };
    case "SET_ACTIVE_LIST_TAB":
      return {
        ...state,
        activeListTab: action.payload,
      };
    case "USER_LISTS":
      return {
        ...state,
        userLists: action.payload,
      };
    case "SET_TOASTETTE":
      return {
        ...state,
        toastette: action.payload,
      };
    case "SET_RELATIVE_LIST_ROLE":
      return {
        ...state,
        relativeListRole: action.payload,
      };
    case "SET_SUCCEFF_LIST_SAVE":
      return {
        ...state,
        succeffListSave: action.payload,
      };
    case "RESET_LIST_INFO":
      return {
        ...state,
        initListInfo: initialState.initListInfo,
      };
    case "SET_LIST_INFO_FROM_JSON":
      return {
        ...state,
        initListInfo: action.payload,
      };
    case "EDITING_LIST_ID":
      return {
        ...state,
        editingListId: action.payload,
      };
    case "SET_INIT_LIST_INFO":
      const { index, key, value } = action.payload;
      return {
        ...state,
        initListInfo: {
          ...state.initListInfo,
          listItems: state.initListInfo.listItems.map((item, i) => {
            if (i === index) {
              return { ...item, [key]: value };
            }
            return item;
          }),
        },
      };

    case "SET_LIST_NUMBER":
      return {
        ...state,
        initListInfo: {
          ...state.initListInfo,
          listItems: action.payload,
        },
      };
    case "SET_INIT_LIST_TOP_INFO":
      const { name, values } = action.payload;
      return {
        ...state,
        initListInfo: {
          ...state.initListInfo,
          [name]: values,
        },
      };
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
