export const validateNFTData = (name, description, imageUrl) => {
  const errors = {};
  
  if (!name || name.trim() === "") {
    errors.name = "NFT Name is required";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!description || description.trim() === "") {
    errors.description = "Description is required";
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!imageUrl) {
    errors.imageUrl = "Image URL is required";
  } else if (!urlPattern.test(imageUrl)) {
    errors.imageUrl = "Please enter a valid URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAmount = (balance, fee = 0) => {
  if (balance === undefined || balance === null || isNaN(balance)) return false;
  if (fee === undefined || fee === null || isNaN(fee)) return false;
  return parseFloat(balance) >= parseFloat(fee);
};

export const formatPublicKey = (key) => {
  if (!key || typeof key !== 'string') return "";
  if (key.length <= 10) return key;
  return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
};
