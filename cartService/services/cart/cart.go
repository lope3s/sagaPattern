package cart

import (
	"cartService/database"
	"context"
)

type CartService struct {
    DB database.Queries
}

func (cs CartService) DropCart(ctx context.Context, cartID int) error {
    return cs.DB.DropCart(ctx, database.DropCartParams{
        ID: cartID,
    })
}

func (cs CartService) AddCartItem(ctx context.Context, productID, productAmount int) (database.Cart, error) {
    return cs.DB.AddCartItem(ctx, database.AddCartItemParams{
        ProductID: productID,
        ProductAmount: productAmount,
    })
}
