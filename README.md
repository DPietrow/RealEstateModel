
Project Overview:

This project uses machine learning to estimate residential property values based on characteristics such as bedrooms, bathrooms, lot size, square footage, and location. The goal was to evaluate multiple machine learning approaches and determine which model provides the most accurate and reliable home price predictions.

The final application includes a React frontend, a Python Flask API backend, and a trained machine learning model capable of generating real-time price estimates.

-------------

Business Application: 

Accurate property valuation is critical across the real estate industry. Home prices are influenced by many variables, making manual valuation difficult and time-consuming. Machine learning models can analyze historical transaction data and uncover patterns that may not be obvious through traditional appraisal methods.

Automated valuation models are already widely used throughout the real estate market to support decision-making and improve efficiency. 

--------------

Business Use Cases:

Home Buyers:

Buyers can use price predictions to determine whether a property is fairly priced before making an offer.

Home Sellers: 

Sellers can estimate a competitive listing price based on comparable property characteristics and market trends.

Real Estate Agents:

Agents can use models like mine to augment their ability to generate pricing estimates when evaluating potential listings or advising clients.

Morgage Lenders:

Financial institutions use valuation models to assess collateral risk when issuing loans.

Real Estate Investors:

Investors can identify potentially undervalued properties and prioritize acquisition opportunities.

--------------

Machine Learning Approach

Rather than selecting a single algorithm and tuning that, I evaluated several machine learning techniques to compare performance, interpretability, and predictive accuracy.
You can see my progression under the folder workbooks. I started with a simple Linear Regression model but found it struggle to capture the nonlinear relationships. 
I then tried an ensemble learning method/random forest model as well as a support vector machine to see if those models can handle the nonlinear complexity. I found they
performed better than a linear regression but were not optimal. I tried a feed forward neural network to see if deeper architecture can capture nonlinear patterns. It had 
higher accurancy than the previous models, but eventually I found gradient boosting decision trees to be the best production model due to it having the strongest performance.

--------------

Feature Engineering:

Several preprocessing and feature engineering techniques were explored to improve predictive performance:

- Geographic clustering
- ZIP code encoding
- Missing value handling
- Log-transformed target variable
- Numerical feature scaling
- Feature selection and importance analysis

These transformations helped the models better capture regional pricing trends and nonlinear relationships within the housing market.

--------------

Stack used:

Frontend: 

- React
- Vite
- Built and deployed on Vercel's free version

Backend:

- Python
- Flask REST API
- Build and deployed on Render's free version

Machine Learning specific:

- Scikit-learn
- LightGBM
- Pandas
- NumPy

--------------

Results: 

The project compared multiple machine learning algorithms and found that tree-based ensemble methods significantly outperformed traditional linear models on this dataset.

Key findings included:

- Linear Regression provided a relatively weak baseline.
- Support Vector Regression captured nonlinear relationships but required substantial tuning.
- Neural Networks performed competitively but required additional training and hyperparameter optimization.
- Random Forests improved predictive accuracy through ensemble learning.
- LightGBM achieved the best balance of accuracy, training speed, and generalization performance.

These results are consistent with in my finds on what the industry uses, where gradient boosting models frequently outperform other approaches on structured real estate datasets.

--------------

Future Improvements:

Potential future enhancements include:

- Adding local economic indicators
- Including market trend data
- Expanding geographic coverage
- Exploring advanced neural network architectures
- Real-time property listing integration

--------------

DISCLAIMER:

This application is intended for educational and demonstration purposes. Predictions are generated using historical data and should not be considered professional appraisals or financial advice.
