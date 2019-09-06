module.exports = function(sequelize, DataTypes) {
	const userProfile = sequelize.define("UserProfile", {
	
		favorite: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		posted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});

	userProfile.associate = function(db) {
        console.log(this)
		userProfile.belongsTo(db.User);
	};

	return userProfile;
};