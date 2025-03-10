"""parent id for floors

Revision ID: c6dcf1d9569c
Revises: 688bc5b657cd
Create Date: 2025-02-23 00:07:54.144540

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6dcf1d9569c'
down_revision: Union[str, None] = '688bc5b657cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
