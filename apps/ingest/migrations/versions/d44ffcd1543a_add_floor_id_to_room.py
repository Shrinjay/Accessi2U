"""Add floor_id to room

Revision ID: d44ffcd1543a
Revises: 9fe3f3876c83
Create Date: 2025-02-23 00:42:57.097879

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd44ffcd1543a'
down_revision: Union[str, None] = '9fe3f3876c83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'room',
        sa.Column(
            'floor_id',
            sa.Integer(),
            sa.ForeignKey('floor.id'),
            nullable=True
        )
    )

def downgrade():
    op.drop_column('room', 'floor_id')
