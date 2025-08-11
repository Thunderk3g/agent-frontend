import React from 'react';

const ProductSidebar: React.FC = () => {
  const products = [
    {
      id: 'health',
      name: 'Health Insurance',
      description: 'Individual & Family Plans',
      iconName: 'health_and_safety',
      color: 'blue'
    },
    {
      id: 'life',
      name: 'Life Insurance',
      description: 'Term & Whole Life Policies',
      iconName: 'family_restroom',
      color: 'green'
    },
    {
      id: 'auto',
      name: 'Auto Insurance',
      description: 'Comprehensive Coverage',
      iconName: 'directions_car',
      color: 'yellow'
    },
    {
      id: 'home',
      name: 'Home Insurance',
      description: 'Property & Liability',
      iconName: 'home',
      color: 'purple'
    },
    {
      id: 'disability',
      name: 'Disability Insurance',
      description: 'Short & Long Term',
      iconName: 'local_hospital',
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'product-icon-blue',
      green: 'product-icon-green',
      yellow: 'product-icon-yellow',
      purple: 'product-icon-purple',
      red: 'product-icon-red'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <aside className="product-sidebar">
      <div className="product-sidebar-content">
        <h3 className="product-sidebar-title">Product List</h3>
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-item"
            >
              <div className={`product-icon ${getColorClasses(product.color)}`}>
                <span className="material-icons">{product.iconName}</span>
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;